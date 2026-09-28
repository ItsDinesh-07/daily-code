import re
from pathlib import Path


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def extract_title_from_file(file_path: Path) -> str:
    """Extract the main H1 title or fallback to slug-based title."""
    try:
        content = file_path.read_text(encoding="utf-8")
        for line in content.splitlines():
            line = line.strip()
            if line.startswith("# "):
                # Remove leading '#' and sanitize
                return line[2:].strip()
    except Exception:
        pass

    # Fallback to filename slug parsing (e.g. 2026-09-28-react-hooks.md -> React Hooks)
    name_without_date = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", file_path.stem)
    return name_without_date.replace("-", " ").title()


def build_readme_content() -> str:
    """Scan the daily directory and generate the full README.md content."""
    root_dir = get_project_root()
    daily_dir = root_dir / "daily"
    daily_dir.mkdir(parents=True, exist_ok=True)

    daily_files = list(daily_dir.glob("*.md"))

    # Extract info for each file
    entries = []
    for f in daily_files:
        # Match YYYY-MM-DD from filename
        match = re.match(r"^(\d{4}-\d{2}-\d{2})-(.+)$", f.name)
        date_str = match.group(1) if match else "Unknown Date"
        title = extract_title_from_file(f)
        rel_path = f"daily/{f.name}"
        entries.append({
            "date": date_str,
            "filename": f.name,
            "title": title,
            "path": rel_path
        })

    # Sort newest first (by date and filename descending)
    entries.sort(key=lambda x: (x["date"], x["filename"]), reverse=True)

    total_count = len(entries)

    # Build markdown table
    if entries:
        table_rows = [
            "| Date | Topic | Link |",
            "| :--- | :--- | :--- |"
        ]
        for entry in entries:
            table_rows.append(f"| `{entry['date']}` | {entry['title']} | [View Code Snippet]({entry['path']}) |")
        table_content = "\n".join(table_rows)
    else:
        table_content = "_No daily code snippets generated yet. The first automated run will populate this table!_"

    readme_markdown = f"""# 🚀 Daily Code Automation

> An automated repository that commits one practical, clean, and useful code snippet every single day powered by the Gemini API and GitHub Actions.

![Daily Code Cron](https://img.shields.io/badge/Automation-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions)
![Python](https://img.shields.io/badge/Python-3.12-brightgreen?style=for-the-badge&logo=python)
![Gemini API](https://img.shields.io/badge/AI-Gemini%20API-orange?style=for-the-badge&logo=google)

---

## 📌 Project Overview
**daily-code** is an automated repository designed to keep your GitHub contribution heatmap consistently green while building a rich personal knowledge base of software engineering concepts.

### 🌟 Covered Domains
- **Java:** OOP Principles, Collections Framework, Streams
- **Spring Boot:** RESTful APIs, Dependency Injection, Exception Handling
- **React (Vite):** Hooks, State Management, Performance Optimization
- **JavaScript:** Async/Await, Closures, Array Manipulation, Event Loop
- **PHP / MySQL (PDO):** Secure Database Connectivity, Prepared Statements, Transactions
- **Firebase:** Firestore CRUD, Authentication, Realtime Listeners
- **SQL:** Joins, Aggregations, Window Functions, Subqueries, Normalization
- **DSA:** Two Pointers, Sliding Window, Binary Search, DP Basics, Trees & Graphs
- **Git & CSS:** Rebase, Stashing, Flexbox, Grid Layouts

---

## 📚 Daily Code Index (Total: {total_count})

{table_content}

---

## ⚙️ How It Works

1. **Scheduled Cron Trigger:** A GitHub Actions workflow (`.github/workflows/daily.yml`) runs daily at 10:00 AM IST (04:30 UTC).
2. **Sequential Topic Selection:** `scripts/generate.py` reads `topics.txt` and tracks used topics in `used_topics.txt` to ensure 100% unique daily content without repetitive snippets.
3. **AI Generation:** Calls the Gemini API (`google-genai` SDK) to produce a concise 2-3 line explanation, an executable code snippet (under 80 lines with comments), and key takeaways.
4. **Automated README Rebuild:** `scripts/update_readme.py` scans the `daily/` directory and updates the table above.
5. **Auto Commit & Push:** GitHub Actions automatically commits and pushes the changes back to the repository.

---

## 🚀 Setup Instructions

### 1. Configure GitHub Repository Secret
- Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
- Click **New repository secret**.
- Set **Name**: `GEMINI_API_KEY`
- Set **Value**: your Google Gemini API key.

### 2. Update Commit Author Info
In `.github/workflows/daily.yml`, replace the placeholder credentials:
```yaml
git config user.name "YOUR_GITHUB_USERNAME"
git config user.email "YOUR_GITHUB_LINKED_EMAIL"
```

### 3. Manual Workflow Test
- Navigate to the **Actions** tab on GitHub.
- Select **Daily Code Generator** from the left sidebar.
- Click **Run workflow** -> **Run workflow** to trigger an instant execution and verify everything works!
"""
    return readme_markdown


def update_readme() -> None:
    """Generate and write content to README.md."""
    root_dir = get_project_root()
    readme_path = root_dir / "README.md"
    content = build_readme_content()
    readme_path.write_text(content, encoding="utf-8")
    print(f"Successfully updated {readme_path}")


if __name__ == "__main__":
    update_readme()
