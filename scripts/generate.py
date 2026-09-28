import os
import re
import subprocess
import sys
import time
import random
from datetime import date
from pathlib import Path

from google import genai

ROOT = Path(__file__).resolve().parent.parent
TOPICS_FILE = ROOT / "topics.txt"
USED_FILE = ROOT / "used_topics.txt"
DAILY_DIR = ROOT / "daily"

PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
EXTRA_MODELS = [m.strip() for m in os.getenv("GEMINI_FALLBACK_MODELS", "").split(",") if m.strip()]
MAX_ATTEMPTS_PER_MODEL = 5
BASE_DELAY = 10  # seconds
RETRYABLE = {429, 500, 502, 503, 504}


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
        print("All topics used. Resetting the list.")
        USED_FILE.write_text("", encoding="utf-8")
        unused = topics
    return unused[0]


def mark_used(topic: str) -> None:
    with USED_FILE.open("a", encoding="utf-8") as f:
        f.write(topic + "\n")


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


def discover_fallbacks(client, exclude: set[str]) -> list[str]:
    """Find other flash models available to this API key."""
    found = []
    try:
        for m in client.models.list():
            name = (m.name or "").replace("models/", "")
            if "flash" not in name:
                continue
            if any(x in name for x in ("image", "tts", "live", "audio", "embedding")):
                continue
            if name not in exclude:
                found.append(name)
    except Exception as e:
        print(f"Could not list models: {e}")
    return sorted(found, reverse=True)[:2]


def error_code(e: Exception):
    code = getattr(e, "code", None)
    if isinstance(code, int):
        return code
    m = re.search(r"\b(4\d\d|5\d\d)\b", str(e))
    return int(m.group(1)) if m else None


def generate_with_model(client, model: str, prompt: str):
    for attempt in range(1, MAX_ATTEMPTS_PER_MODEL + 1):
        print(f"Requesting '{model}' (attempt {attempt}/{MAX_ATTEMPTS_PER_MODEL})...")
        try:
            resp = client.models.generate_content(model=model, contents=prompt)
            text = (resp.text or "").strip()
            if len(text) < 200:
                raise ValueError("Response too short/empty")
            return text
        except Exception as e:
            code = error_code(e)
            print(f"  Failed: {str(e)[:200]}")
            if code == 404:
                print("  Model not available, moving to next model.")
                return None
            if code is not None and code not in RETRYABLE and not isinstance(e, ValueError):
                print("  Non-retryable error, moving to next model.")
                return None
            if attempt < MAX_ATTEMPTS_PER_MODEL:
                delay = BASE_DELAY * (2 ** (attempt - 1)) + random.uniform(0, 3)
                print(f"  Waiting {delay:.0f}s before retry...")
                time.sleep(delay)
    return None


def main() -> None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        sys.exit("Fatal: GEMINI_API_KEY is not set.")

    today = date.today().isoformat()
    DAILY_DIR.mkdir(exist_ok=True)

    if not os.getenv("FORCE") and any(DAILY_DIR.glob(f"{today}-*.md")):
        print(f"A file for {today} already exists. Skipping.")
        return

    topic = pick_topic()
    print(f"Selected topic: '{topic}'")

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
    content = None
    tried = set()
    for model in models:
        tried.add(model)
        content = generate_with_model(client, model, prompt)
        if content:
            break

    if not content:
        for model in discover_fallbacks(client, tried):
            print(f"Trying auto-discovered fallback: {model}")
            content = generate_with_model(client, model, prompt)
            if content:
                break

    if not content:
        sys.exit("Fatal: all models failed. Nothing committed.")

    out_file = DAILY_DIR / f"{today}-{slugify(topic)}.md"
    out_file.write_text(content + "\n", encoding="utf-8")
    mark_used(topic)
    print(f"Created: {out_file.relative_to(ROOT)}")

    readme_script = ROOT / "scripts" / "update_readme.py"
    if readme_script.exists():
        subprocess.run([sys.executable, str(readme_script)], check=True)


if __name__ == "__main__":
    main()