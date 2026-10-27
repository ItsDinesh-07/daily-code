"""Send an email summary after the daily-code workflow.

Environment variables:
  SMTP_USER, SMTP_APP_PASSWORD, EMAIL_TO   required (GitHub secrets)
  SMTP_HOST (default smtp.gmail.com), SMTP_PORT (default 465, SSL)
  BEFORE_SHA              commit SHA before the generator ran
  STATUS                  "success" (default) or "failure"
  FORCE_SEND              "1" sends a test email even when there are no new commits
  EMAIL_INCLUDE_SNIPPET   "1" (default) or "0"
  DRY_RUN                 "1" prints the email instead of sending it
  GITHUB_REPOSITORY, GITHUB_SERVER_URL, GITHUB_RUN_ID   set by GitHub Actions

This script never fails the workflow: it always exits with code 0.
"""

import os
import smtplib
import ssl
import subprocess
import sys
import time
from datetime import date
from email.message import EmailMessage
from pathlib import Path

# Ensure UTF-8 output handling on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
SNIPPET_MAX_LINES = 60
SNIPPET_MAX_CHARS = 4000


def log(msg: str) -> None:
    try:
        print(msg, flush=True)
    except UnicodeEncodeError:
        encoding = sys.stdout.encoding or "utf-8"
        print(msg.encode(encoding, errors="replace").decode(encoding), flush=True)


def git(*args: str) -> str:
    res = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    return res.stdout.strip() if res.returncode == 0 else ""


def get_urls() -> tuple[str, str, str]:
    server = os.getenv("GITHUB_SERVER_URL", "https://github.com")
    repo = os.getenv("GITHUB_REPOSITORY", "ItsDinesh-07/daily-code")
    run_id = os.getenv("GITHUB_RUN_ID", "")
    run_url = f"{server}/{repo}/actions/runs/{run_id}" if run_id else f"{server}/{repo}/actions"
    return server, repo, run_url


def new_commits(before: str) -> list[tuple[str, str]]:
    """Commits created since BEFORE_SHA, oldest first, as (sha, subject)."""
    if not before:
        return []
    out = git("log", "--reverse", "--pretty=format:%H|%s", f"{before}..HEAD")
    commits = []
    for line in out.splitlines():
        sha, _, subject = line.partition("|")
        if sha:
            commits.append((sha, subject))
    return commits


def changed_files(before: str) -> list[str]:
    if not before:
        return []
    out = git("diff", "--name-only", f"{before}..HEAD")
    return [line.strip() for line in out.splitlines() if line.strip()]


def first_heading(path: Path) -> str:
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("# "):
                return line[2:].strip()
    except OSError:
        pass
    return path.stem


def snippet_preview(path: Path) -> str:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return ""
    text = "\n".join(lines[:SNIPPET_MAX_LINES])
    if len(text) > SNIPPET_MAX_CHARS:
        text = text[:SNIPPET_MAX_CHARS].rstrip() + "\n..."
    elif len(lines) > SNIPPET_MAX_LINES:
        text += "\n..."
    return text


def build_success(before: str, force: bool):
    """Return (subject, body) or None when there is nothing to report."""
    server, repo, run_url = get_urls()
    commits = new_commits(before)
    files = changed_files(before)
    today = date.today().isoformat()

    if not commits:
        if force:
            return (
                "🧪 Daily Code email test",
                "Email setup is working.\n\nThis run created no new commits, "
                "so this is only a test message.\n\n"
                f"Workflow run: {run_url}\n",
            )
        return None

    main_files = [f for f in files if f.startswith("daily/") and f.endswith(".md")]
    topic = first_heading(ROOT / main_files[0]) if main_files else "Daily update"
    count = len(commits)
    subject = f"✅ Daily Code updated: {topic} ({count} commit{'s' if count != 1 else ''})"

    lines = [f"Daily Code was updated on {today}.", "", f"Topic: {topic}", "", "Commits:"]
    for sha, msg in commits:
        lines.append(f"  - {msg}")
        lines.append(f"    {server}/{repo}/commit/{sha}")

    shown = [f for f in files if f.startswith(("daily/", "extras/")) and f.endswith(".md")]
    if shown:
        lines += ["", "Files:"]
        for f in shown:
            lines.append(f"  - {f}")
            lines.append(f"    {server}/{repo}/blob/main/{f}")

    if main_files and os.getenv("EMAIL_INCLUDE_SNIPPET", "1") != "0":
        preview = snippet_preview(ROOT / main_files[0])
        if preview:
            lines += ["", "Snippet preview:", "-" * 40, preview, "-" * 40]

    lines += ["", f"Repository: {server}/{repo}", f"Workflow run: {run_url}", ""]
    return subject, "\n".join(lines)


def build_failure():
    server, repo, run_url = get_urls()
    today = date.today().isoformat()
    subject = f"❌ Daily Code run failed ({today})"
    body = (
        "The Daily Code workflow failed.\n\n"
        f"Open the run and check the failed step:\n{run_url}\n\n"
        "The backup cron or a manual 'Run workflow' will try again.\n"
    )
    return subject, body


def send(subject: str, body: str, user: str, password: str, to_addr: str) -> None:
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "465"))
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = user
    msg["To"] = to_addr
    msg.set_content(body)
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=context, timeout=30) as server:
        server.login(user, password)
        server.send_message(msg)


def is_transient_error(e: Exception) -> bool:
    if isinstance(e, smtplib.SMTPAuthenticationError):
        return False
    if isinstance(e, smtplib.SMTPResponseException):
        return 400 <= e.smtp_code < 500
    if isinstance(e, (TimeoutError, ConnectionError, OSError, smtplib.SMTPServerDisconnected, smtplib.SMTPConnectError)):
        return True
    return False


def send_with_retry(subject: str, body: str, user: str, password: str, to_addr: str) -> bool:
    delays = [5, 15]
    max_attempts = 3
    for attempt in range(1, max_attempts + 1):
        try:
            send(subject, body, user, password, to_addr)
            log(f"Email sent: {subject}")
            return True
        except smtplib.SMTPAuthenticationError as e:
            log(f"Warning: could not send email: {type(e).__name__}: {e}")
            log("Check SMTP_APP_PASSWORD (16 characters, no spaces) and that 2-Step Verification is enabled.")
            return False
        except Exception as e:
            if attempt < max_attempts and is_transient_error(e):
                delay = delays[attempt - 1]
                log(f"Transient error on attempt {attempt}/{max_attempts} ({type(e).__name__}: {e}). Retrying in {delay}s...")
                time.sleep(delay)
                continue
            log(f"Warning: could not send email: {type(e).__name__}: {e}")
            return False
    return False


def main() -> int:
    status = os.getenv("STATUS", "success").lower()
    before = os.getenv("BEFORE_SHA", "")
    force = os.getenv("FORCE_SEND", "0") == "1"
    dry_run = os.getenv("DRY_RUN", "").lower() in ("1", "true", "yes")

    user = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_APP_PASSWORD", "")
    to_addr = os.getenv("EMAIL_TO", "") or user

    if not dry_run and not (user and password and to_addr):
        log("Email secrets are not set. Skipping email.")
        return 0

    result = build_failure() if status == "failure" else build_success(before, force)
    if result is None:
        log("No new commits in this run. No email sent.")
        return 0
    subject, body = result

    if dry_run:
        log("[DRY_RUN] Email not sent. Preview:")
        log(f"Subject: {subject}\n")
        log(body)
        return 0

    try:
        send_with_retry(subject, body, user, password, to_addr)
    except Exception as e:
        log(f"Warning: unexpected error sending email: {type(e).__name__}: {e}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())