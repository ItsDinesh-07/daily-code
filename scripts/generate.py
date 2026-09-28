import os
import re
import subprocess
import sys
import time
from datetime import date
from pathlib import Path

from google import genai

ROOT = Path(__file__).resolve().parent.parent
TOPICS_FILE = ROOT / "topics.txt"
USED_FILE = ROOT / "used_topics.txt"
DAILY_DIR = ROOT / "daily"

PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
EXTRA_MODELS = [m.strip() for m in os.getenv("GEMINI_FALLBACK_MODELS", "").split(",") if m.strip()]

ROUNDS = 4
ROUND_DELAYS = [20, 45, 90]   # seconds between rounds
TIME_BUDGET = 12 * 60         # total seconds
RETRYABLE = {500, 502, 503, 504}

HARD_SKIP = ("image", "tts", "live", "audio", "embedding", "robotics", "computer-use", "aqa")
DEMOTE = ("omni", "preview", "exp")


def log(msg: str) -> None:
    print(msg, flush=True)


def read_lines(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [l.strip() for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]


def pick_topic() -> str:
    topics = read_lines(TOPICS_FILE)
    if not topics:
        sys.exit("Fatal: topics.txt is empty.")
    used = set(read_lines(USED_FILE))
    unused = [t for t in topics if t not in used]
    if not unused:
        log("All topics used. Resetting the list.")
        USED_FILE.write_text("", encoding="utf-8")
        unused = topics
    return unused[0]


def mark_used(topic: str) -> None:
    with USED_FILE.open("a", encoding="utf-8") as f:
        f.write(topic + "\n")


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


def discover_models(client, exclude: set[str]) -> list[str]:
    """Other text models this key can use: stable lite, stable flash, then experimental ones."""
    stable, demoted = [], []
    try:
        for m in client.models.list():
            name = (m.name or "").replace("models/", "")
            if "gemini" not in name or "flash" not in name:
                continue
            if name in exclude or any(x in name for x in HARD_SKIP):
                continue
            actions = getattr(m, "supported_actions", None)
            if actions and "generateContent" not in actions:
                continue
            (demoted if any(x in name for x in DEMOTE) else stable).append(name)
    except Exception as e:
        log(f"Could not list models: {e}")

    stable.sort(key=lambda n: ("lite" not in n, n))
    return stable[:3] + sorted(demoted)[:1]


def error_code(e: Exception):
    code = getattr(e, "code", None)
    if isinstance(code, int):
        return code
    m = re.search(r"\b(4\d\d|5\d\d)\b", str(e))
    return int(m.group(1)) if m else None


def try_model(client, model: str, prompt: str):
    """One attempt. Returns (text, status): status is ok | retry | quota | dead."""
    log(f"Requesting '{model}'...")
    try:
        resp = client.models.generate_content(model=model, contents=prompt)
        text = (resp.text or "").strip()
        if len(text) < 200:
            log("  Response too short, will retry later.")
            return None, "retry"
        return text, "ok"
    except Exception as e:
        code = error_code(e)
        log(f"  Failed ({code}): {str(e)[:160]}")
        if code == 429:
            return None, "quota"
        if code in RETRYABLE:
            return None, "retry"
        return None, "dead"   # 404, 400, 403 etc.


def main() -> None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        sys.exit("Fatal: GEMINI_API_KEY is not set.")

    today = date.today().isoformat()
    DAILY_DIR.mkdir(exist_ok=True)

    if not os.getenv("FORCE") and any(DAILY_DIR.glob(f"{today}-*.md")):
        log(f"A file for {today} already exists. Skipping.")
        return

    topic = pick_topic()
    log(f"Selected topic: '{topic}'")

    prompt = (
        f"Write one small, correct, well-commented, runnable code example for: {topic}.\n"
        "Return a Markdown file with exactly this structure:\n"
        "1. A '# ' title\n"
        "2. A 2-3 line explanation\n"
        "3. One fenced code block (under 80 lines) with helpful comments\n"
        "4. A '## Key takeaways' bullet list\n"
        "No filler, no text outside the Markdown file."
    )

    client = genai.Client(api_key=api_key)

    models = [PRIMARY_MODEL] + [m for m in EXTRA_MODELS if m != PRIMARY_MODEL]
    models += discover_models(client, set(models))
    log(f"Model order: {models}")

    strikes = {m: 0 for m in models}
    start = time.time()
    content = None

    for rnd in range(ROUNDS):
        log(f"--- Round {rnd + 1}/{ROUNDS} ---")
        for model in list(models):
            if time.time() - start > TIME_BUDGET:
                break
            text, status = try_model(client, model, prompt)
            if status == "ok":
                content = text
                break
            if status == "dead":
                models.remove(model)
            elif status == "quota":
                strikes[model] += 1
                if strikes[model] >= 2:
                    log(f"  Dropping '{model}' (quota).")
                    models.remove(model)

        if content or not models or time.time() - start > TIME_BUDGET:
            break
        if rnd < ROUNDS - 1:
            delay = ROUND_DELAYS[min(rnd, len(ROUND_DELAYS) - 1)]
            log(f"All models busy. Waiting {delay}s...")
            time.sleep(delay)

    if not content:
        sys.exit("Fatal: all models failed. Nothing committed.")

    out_file = DAILY_DIR / f"{today}-{slugify(topic)}.md"
    out_file.write_text(content + "\n", encoding="utf-8")
    mark_used(topic)
    log(f"Created: {out_file.relative_to(ROOT)}")

    readme_script = ROOT / "scripts" / "update_readme.py"
    if readme_script.exists():
        subprocess.run([sys.executable, str(readme_script)], check=True)


if __name__ == "__main__":
    main()