
import json
import os
import random
import re
import subprocess
import sys
import time
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOPICS_FILE = ROOT / "topics.txt"
USED_FILE = ROOT / "used_topics.txt"
DAILY_DIR = ROOT / "daily"
EXTRAS_DIR = ROOT / "extras"
PRACTICE_DIR = EXTRAS_DIR / "practice"
NOTES_DIR = EXTRAS_DIR / "notes"
INDEX_FILE = EXTRAS_DIR / "INDEX.md"
PROGRESS_FILE = EXTRAS_DIR / ".progress.json"

PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
EXTRA_MODELS = [m.strip() for m in os.getenv("GEMINI_FALLBACK_MODELS", "").split(",") if m.strip()]

ROUNDS = 4
ROUND_DELAYS = [20, 45, 90]        # seconds between rounds
TIME_BUDGET_PER_STEP = 4 * 60     # 4 minutes per step
RETRYABLE = {500, 502, 503, 504}

HARD_SKIP = ("image", "tts", "live", "audio", "embedding", "robotics", "computer-use", "aqa")
DEMOTE = ("omni", "preview", "exp")

ALL_STEP_NAMES = ["main", "tests", "notes", "index"]


def log(msg: str) -> None:
    print(msg, flush=True)


def read_lines(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


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
    used = read_lines(USED_FILE)
    if topic not in used:
        with USED_FILE.open("a", encoding="utf-8") as f:
            f.write(topic + "\n")


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except Exception as e:
            log(f"Warning: Could not parse progress file {PROGRESS_FILE}: {e}")
    return {}


def save_progress(data: dict) -> None:
    EXTRAS_DIR.mkdir(parents=True, exist_ok=True)
    PROGRESS_FILE.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def decide_target_commits(today_str: str) -> int:
    """Decide today's commit count N between COMMITS_MIN and COMMITS_MAX (or COMMITS_TODAY)."""
    forced = os.getenv("COMMITS_TODAY")
    if forced:
        try:
            val = int(forced)
            target = max(1, min(len(ALL_STEP_NAMES), val))
            log(f"Forced commit count for today via COMMITS_TODAY: {target}")
            return target
        except ValueError:
            log(f"Warning: Invalid COMMITS_TODAY='{forced}', ignoring.")

    try:
        min_commits = int(os.getenv("COMMITS_MIN", "1"))
    except ValueError:
        min_commits = 1
    try:
        max_commits = int(os.getenv("COMMITS_MAX", "4"))
    except ValueError:
        max_commits = 4

    if min_commits > max_commits:
        min_commits, max_commits = max_commits, min_commits
    min_commits = max(1, min_commits)
    max_commits = min(len(ALL_STEP_NAMES), max(min_commits, max_commits))

    rng = random.Random(today_str)
    target = rng.randint(min_commits, max_commits)
    log(f"Chosen commit count for today ({today_str}): {target} (range: {min_commits}-{max_commits})")
    return target


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


def validate_markdown(text: str, step_name: str) -> bool:
    """Validate that Gemini output is non-empty, of good length, and has valid Markdown structure."""
    if not text or len(text.strip()) < 200:
        return False
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not any(line.startswith("# ") for line in lines):
        return False

    text_lower = text.lower()
    if step_name == "main":
        if "```" not in text:
            return False
        if "takeaway" not in text_lower and "key" not in text_lower:
            return False
    elif step_name == "tests":
        if "exercise" not in text_lower and "practice" not in text_lower and "question" not in text_lower:
            return False
    elif step_name == "notes":
        if ("pitfall" not in text_lower and "mistake" not in text_lower) and ("interview" not in text_lower and "tip" not in text_lower):
            return False

    return True


def get_prompt_for_step(step_name: str, topic: str) -> str:
    """Return specific, non-repetitive prompt for each step."""
    if step_name == "main":
        return (
            f"Write one small, correct, well-commented, runnable code example for: {topic}.\n"
            "Return a Markdown file with exactly this structure:\n"
            "1. A '# ' title\n"
            "2. A 2-3 line explanation\n"
            "3. One fenced code block (under 80 lines) with helpful comments\n"
            "4. A '## Key takeaways' bullet list\n"
            "No filler, no text outside the Markdown file."
        )
    elif step_name == "tests":
        return (
            f"Write a short practice and exercise section for the topic: {topic}.\n"
            "Return a Markdown file with exactly this structure:\n"
            f"1. A '# Practice Exercises: {topic}' title\n"
            "2. A brief 1-2 line intro stating the practical objective\n"
            "3. Exactly 3 exercise questions testing practical understanding. For each exercise provide:\n"
            "   - Clear problem task\n"
            "   - Starter code or scenario\n"
            "   - Expected output, assertion, or solution snippet\n"
            "4. A '## Self-Check Checklist' with 3-4 bullet points\n"
            "No filler, no text outside the Markdown file."
        )
    elif step_name == "notes":
        return (
            f"Write a concise notes and interview guide for the topic: {topic}.\n"
            "Return a Markdown file with exactly this structure:\n"
            f"1. A '# Notes & Interview Tips: {topic}' title\n"
            "2. A '## Common Pitfalls & Anti-Patterns' section with 2-3 specific mistakes developers make and how to avoid them\n"
            "3. A '## Key Interview Questions' section with 3 typical technical interview questions and concise model answers\n"
            "4. A '## Best Practices Summary' bullet list\n"
            "No filler, no text outside the Markdown file."
        )
    else:
        raise ValueError(f"Unknown Gemini step: {step_name}")


def generate_step_content(
    client,
    models: list[str],
    prompt: str,
    step_name: str,
    start_time: float,
    time_budget: int = TIME_BUDGET_PER_STEP,
) -> str | None:
    """Shared reusable model rotation and retry helper with quota handling and 4-minute time budget."""
    active_models = list(models)
    strikes = {m: 0 for m in active_models}

    for rnd in range(ROUNDS):
        log(f"--- Round {rnd + 1}/{ROUNDS} ({step_name}) ---")
        for model in list(active_models):
            if time.time() - start_time > time_budget:
                log(f"Time budget ({time_budget}s) for '{step_name}' exceeded.")
                return None

            text, status = try_model(client, model, prompt)
            if status == "ok" and text:
                if validate_markdown(text, step_name):
                    return text
                log(f"  Markdown structure validation failed for '{step_name}', retrying...")

            if status == "dead":
                if model in active_models:
                    active_models.remove(model)
            elif status == "quota":
                strikes[model] = strikes.get(model, 0) + 1
                if strikes[model] >= 2:
                    log(f"  Dropping '{model}' (quota).")
                    if model in active_models:
                        active_models.remove(model)

        if not active_models or (time.time() - start_time > time_budget):
            break

        if rnd < ROUNDS - 1:
            delay = ROUND_DELAYS[min(rnd, len(ROUND_DELAYS) - 1)]
            log(f"All models busy for '{step_name}'. Waiting {delay}s...")
            time.sleep(delay)

    return None


def run_readme_update() -> None:
    """Run update_readme.py to rebuild README.md."""
    readme_script = ROOT / "scripts" / "update_readme.py"
    if readme_script.exists():
        subprocess.run([sys.executable, str(readme_script)], check=True)


def build_extras_index_content() -> str:
    """Generate extras/INDEX.md content listing all practice and notes files, newest first."""
    items = []

    # Collect practice files
    if PRACTICE_DIR.exists():
        for f in PRACTICE_DIR.glob("*-practice.md"):
            m = re.match(r"^(\d{4}-\d{2}-\d{2})-(.+)-practice\.md$", f.name)
            date_str = m.group(1) if m else "Unknown"
            slug = m.group(2) if m else f.stem
            topic = slug.replace("-", " ").title()
            daily_match = list(DAILY_DIR.glob(f"{date_str}-{slug}.md"))
            if daily_match:
                try:
                    for l in daily_match[0].read_text(encoding="utf-8").splitlines():
                        if l.strip().startswith("# "):
                            topic = l.strip()[2:].strip()
                            break
                except Exception:
                    pass
            items.append({
                "date": date_str,
                "topic": topic,
                "type": "Practice Questions",
                "rel_link": f"practice/{f.name}",
                "filename": f.name,
            })

    # Collect notes files
    if NOTES_DIR.exists():
        for f in NOTES_DIR.glob("*-notes.md"):
            m = re.match(r"^(\d{4}-\d{2}-\d{2})-(.+)-notes\.md$", f.name)
            date_str = m.group(1) if m else "Unknown"
            slug = m.group(2) if m else f.stem
            topic = slug.replace("-", " ").title()
            daily_match = list(DAILY_DIR.glob(f"{date_str}-{slug}.md"))
            if daily_match:
                try:
                    for l in daily_match[0].read_text(encoding="utf-8").splitlines():
                        if l.strip().startswith("# "):
                            topic = l.strip()[2:].strip()
                            break
                except Exception:
                    pass
            items.append({
                "date": date_str,
                "topic": topic,
                "type": "Notes & Interview Tips",
                "rel_link": f"notes/{f.name}",
                "filename": f.name,
            })

    items.sort(key=lambda x: (x["date"], x["filename"]), reverse=True)

    if items:
        table_rows = [
            "| Date | Topic | Resource | Link |",
            "| :--- | :--- | :--- | :--- |",
        ]
        for it in items:
            table_rows.append(f"| `{it['date']}` | {it['topic']} | {it['type']} | [View Resource]({it['rel_link']}) |")
        table_content = "\n".join(table_rows)
    else:
        table_content = "_No practice exercises or notes generated yet._"

    return f"""# 📚 Extras Index: Practice & Notes

> A complete catalog of supplementary practice exercises, common mistakes, and interview tips accompanying daily code snippets.

{table_content}
"""


def git_commit_step(files_to_stage: list[Path], message: str, dry_run: bool = False) -> bool:
    """Add only the files of this step and commit with step message."""
    if dry_run:
        rel_files = [str(f.relative_to(ROOT)) for f in files_to_stage if f.exists()]
        log(f"[DRY_RUN] git add {' '.join(rel_files) if rel_files else '(none)'}")
        log(f"[DRY_RUN] git commit -m \"{message}\"")
        return True

    existing_files = [f for f in files_to_stage if f.exists()]
    if not existing_files:
        log("No existing files to stage for this step.")
        return False

    add_cmd = ["git", "add"] + [str(f.relative_to(ROOT)) for f in existing_files]
    res_add = subprocess.run(add_cmd, cwd=ROOT, capture_output=True, text=True)
    if res_add.returncode != 0:
        log(f"git add failed: {res_add.stderr}")
        return False

    diff_cmd = ["git", "diff", "--cached", "--quiet"]
    res_diff = subprocess.run(diff_cmd, cwd=ROOT)
    if res_diff.returncode == 0:
        log("No changes staged to commit for this step.")
        return False

    commit_cmd = ["git", "commit", "-m", message]
    res_commit = subprocess.run(commit_cmd, cwd=ROOT, capture_output=True, text=True)
    if res_commit.returncode != 0:
        log(f"git commit failed: {res_commit.stderr}")
        return False

    log(f"Committed: {message}")
    return True


def sleep_between_commits(dry_run: bool = False) -> None:
    """Add a 20-90 second sleep between commits so commit timestamps look natural."""
    delay = random.randint(20, 90)
    if dry_run:
        log(f"[DRY_RUN] Simulated sleep of {delay}s between commits.")
        return
    log(f"Sleeping {delay}s between commits for realistic commit interval...")
    time.sleep(delay)


def main() -> None:
    dry_run = os.getenv("DRY_RUN", "").lower() in ("1", "true", "yes")
    force = bool(os.getenv("FORCE"))

    today = date.today().isoformat()
    DAILY_DIR.mkdir(exist_ok=True)
    EXTRAS_DIR.mkdir(exist_ok=True)
    PRACTICE_DIR.mkdir(parents=True, exist_ok=True)
    NOTES_DIR.mkdir(parents=True, exist_ok=True)

    if dry_run:
        log(f"[DRY_RUN] Mode active: Skipping live Gemini API calls, progress file disk operations, and Git commits.")

    target_commits = decide_target_commits(today)
    planned_steps = ALL_STEP_NAMES[:target_commits]
    log(f"Today: {today} | Planned commits count: {target_commits} | Steps: {planned_steps}")

    # Load existing progress or detect from disk (DRY_RUN must never read real progress file)
    if dry_run:
        progress = {"date": today, "topic": "", "slug": "", "target": target_commits, "done": []}
    else:
        progress = load_progress()
        if progress.get("date") != today:
            progress = {"date": today, "topic": "", "slug": "", "target": target_commits, "done": []}

    done_steps = list(progress.get("done", []))

    # Detect if step 1 ("main") already exists on disk
    existing_daily_files = list(DAILY_DIR.glob(f"{today}-*.md")) if not dry_run else []
    if existing_daily_files and "main" not in done_steps:
        done_steps.append("main")

    # If progress already has a topic, reuse it; otherwise pick a topic
    if progress.get("topic") and progress.get("slug"):
        topic = progress["topic"]
        slug = progress["slug"]
    elif existing_daily_files:
        daily_file = existing_daily_files[0]
        slug = daily_file.stem[len(today) + 1:]
        topic = ""
        try:
            for l in daily_file.read_text(encoding="utf-8").splitlines():
                if l.strip().startswith("# "):
                    topic = l.strip()[2:].strip()
                    break
        except Exception:
            pass
        if not topic:
            topic = slug.replace("-", " ").title()
    else:
        topic = pick_topic()
        slug = slugify(topic)

    progress["topic"] = topic
    progress["slug"] = slug
    progress["target"] = target_commits
    progress["done"] = done_steps

    log(f"Topic for today: '{topic}' (slug: '{slug}')")

    # Idempotency check: are all planned steps already done?
    remaining_steps = [s for s in planned_steps if s not in done_steps]
    if not force and not remaining_steps:
        log(f"Already complete for today. All {target_commits} planned step(s) ({planned_steps}) done.")
        return

    log(f"Remaining steps to execute today: {remaining_steps}")

    # Prepare Gemini client if needed
    client = None
    models = []
    if not dry_run and any(s in ("main", "tests", "notes") for s in remaining_steps):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            sys.exit("Fatal: GEMINI_API_KEY is not set.")
        from google import genai
        client = genai.Client(api_key=api_key)
        models = [PRIMARY_MODEL] + [m for m in EXTRA_MODELS if m != PRIMARY_MODEL]
        models += discover_models(client, set(models))
        log(f"Model order: {models}")

    steps_executed = 0
    readme_file = ROOT / "README.md"

    for step_index, step_name in enumerate(remaining_steps):
        log(f"\n==========================================")
        log(f"Executing step: '{step_name}' ({step_index + 1}/{len(remaining_steps)})")
        log(f"==========================================")

        # Reset start_time at beginning of each step for 4-minute per-step budget
        step_start_time = time.time()

        # Realistic sleep between commits if this is not the first executed step today
        if steps_executed > 0:
            sleep_between_commits(dry_run)

        if step_name == "main":
            out_file = DAILY_DIR / f"{today}-{slug}.md"
            commit_msg = f"feat: add {topic} example [{today}]"

            if dry_run:
                log(f"[DRY_RUN] Plan step 'main':")
                log(f"  Target Files: {out_file.relative_to(ROOT).as_posix()}, {readme_file.relative_to(ROOT).as_posix()}")
                log(f"  Commit Message: {commit_msg}")
            else:
                prompt = get_prompt_for_step("main", topic)
                content = generate_step_content(client, models, prompt, "main", step_start_time, TIME_BUDGET_PER_STEP)
                if not content:
                    if steps_executed == 0:
                        sys.exit("Fatal: failed to generate main content and 0 commits made today.")
                    log("Warning: Failed to generate main content. Stopping further steps for today.")
                    break

                out_file.write_text(content + "\n", encoding="utf-8")
                mark_used(topic)
                log(f"Created: {out_file.relative_to(ROOT)}")

                # Update README.md and include in commit
                run_readme_update()

                if "main" not in progress["done"]:
                    progress["done"].append("main")
                save_progress(progress)

                git_commit_step([out_file, readme_file, USED_FILE, PROGRESS_FILE], commit_msg, dry_run=False)

            steps_executed += 1

        elif step_name == "tests":
            out_file = PRACTICE_DIR / f"{today}-{slug}-practice.md"
            commit_msg = f"test: add practice questions for {topic} [{today}]"

            if dry_run:
                log(f"[DRY_RUN] Plan step 'tests':")
                log(f"  Target Files: {out_file.relative_to(ROOT).as_posix()}, {readme_file.relative_to(ROOT).as_posix()}")
                log(f"  Commit Message: {commit_msg}")
            else:
                prompt = get_prompt_for_step("tests", topic)
                content = generate_step_content(client, models, prompt, "tests", step_start_time, TIME_BUDGET_PER_STEP)
                if not content:
                    log("Warning: Failed to generate practice tests content. Stopping further steps for today.")
                    break

                out_file.write_text(content + "\n", encoding="utf-8")
                log(f"Created: {out_file.relative_to(ROOT)}")

                # Update README.md and include in commit
                run_readme_update()

                if "tests" not in progress["done"]:
                    progress["done"].append("tests")
                save_progress(progress)

                git_commit_step([out_file, readme_file, PROGRESS_FILE], commit_msg, dry_run=False)

            steps_executed += 1

        elif step_name == "notes":
            out_file = NOTES_DIR / f"{today}-{slug}-notes.md"
            commit_msg = f"docs: add notes and interview tips for {topic} [{today}]"

            if dry_run:
                log(f"[DRY_RUN] Plan step 'notes':")
                log(f"  Target Files: {out_file.relative_to(ROOT).as_posix()}, {readme_file.relative_to(ROOT).as_posix()}")
                log(f"  Commit Message: {commit_msg}")
            else:
                prompt = get_prompt_for_step("notes", topic)
                content = generate_step_content(client, models, prompt, "notes", step_start_time, TIME_BUDGET_PER_STEP)
                if not content:
                    log("Warning: Failed to generate notes content. Stopping further steps for today.")
                    break

                out_file.write_text(content + "\n", encoding="utf-8")
                log(f"Created: {out_file.relative_to(ROOT)}")

                # Update README.md and include in commit
                run_readme_update()

                if "notes" not in progress["done"]:
                    progress["done"].append("notes")
                save_progress(progress)

                git_commit_step([out_file, readme_file, PROGRESS_FILE], commit_msg, dry_run=False)

            steps_executed += 1

        elif step_name == "index":
            commit_msg = f"docs: update extras index [{today}]"

            if dry_run:
                log(f"[DRY_RUN] Plan step 'index':")
                log(f"  Target Files: {INDEX_FILE.relative_to(ROOT).as_posix()}")
                log(f"  Commit Message: {commit_msg}")
            else:
                index_content = build_extras_index_content()
                INDEX_FILE.write_text(index_content, encoding="utf-8")
                log(f"Updated: {INDEX_FILE.relative_to(ROOT)}")

                if "index" not in progress["done"]:
                    progress["done"].append("index")
                save_progress(progress)

                git_commit_step([INDEX_FILE, PROGRESS_FILE], commit_msg, dry_run=False)

            steps_executed += 1

    if dry_run:
        log(f"\n[DRY_RUN] Successfully simulated plan for today ({len(planned_steps)} commit(s)).")
    else:
        log(f"\nSuccessfully completed {steps_executed} planned step(s) for today.")


if __name__ == "__main__":
    main()