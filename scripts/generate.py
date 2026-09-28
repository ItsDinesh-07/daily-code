import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

# Add script directory to path so we can import update_readme
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
sys.path.append(str(SCRIPT_DIR))

from update_readme import update_readme
from google import genai


def slugify(text: str) -> str:
    """Convert text to a clean URL/filename slug."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")


def get_next_topic(root_dir: Path) -> str:
    """Read topics from topics.txt, pick next unused topic, update used_topics.txt."""
    topics_file = root_dir / "topics.txt"
    used_topics_file = root_dir / "used_topics.txt"

    if not topics_file.exists():
        print(f"Error: {topics_file} not found.", file=sys.stderr)
        sys.exit(1)

    topics = [
        line.strip()
        for line in topics_file.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    if not topics:
        print("Error: topics.txt is empty.", file=sys.stderr)
        sys.exit(1)

    used_topics = []
    if used_topics_file.exists():
        used_topics = [
            line.strip()
            for line in used_topics_file.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]

    unused_topics = [t for t in topics if t not in used_topics]

    # Reset cycle when all topics have been used
    if not unused_topics:
        print("All topics used! Resetting used_topics cycle.")
        used_topics = []
        unused_topics = topics

    next_topic = unused_topics[0]
    used_topics.append(next_topic)

    used_topics_file.write_text("\n".join(used_topics) + "\n", encoding="utf-8")
    return next_topic


def clean_markdown_output(content: str) -> str:
    """Remove surrounding markdown codeblock wrappers if LLM included them."""
    cleaned = content.strip()
    if cleaned.startswith("```markdown"):
        cleaned = cleaned[len("```markdown"):].strip()
    elif cleaned.startswith("```md"):
        cleaned = cleaned[len("```md"):].strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:].strip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    return cleaned


def generate_daily_code() -> None:
    """Generate daily code snippet via Gemini API and update project."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    topic = get_next_topic(PROJECT_ROOT)
    print(f"Selected Topic: '{topic}'")

    prompt = f"""You are an expert software developer and technical educator.
Create a high-quality, practical code tutorial in Markdown format for the topic: "{topic}".

Follow this exact Markdown structure:

# {topic}

## Explanation
Provide a clear, 2 to 3 line explanation of what this concept is, how it works, and why it is useful in real-world applications.

## Code Example
Provide ONE clean, fully working, well-commented code example demonstrating this topic.
- Keep the code concise and readable (strictly under 80 lines).
- Include clear inline comments explaining key lines.
- Use appropriate language syntax highlighting block (e.g. java, python, javascript, php, sql, css, html, bash).

## Key Takeaways
- Provide 3 clear bullet points highlighting best practices, common pitfalls, or core learnings.

Important rules:
- Do NOT wrap your entire output in a markdown block.
- Do NOT include conversational filler text before or after the markdown content.
- Ensure code example is accurate, modern, and production-minded.
"""

    client = genai.Client(api_key=api_key)
    max_retries = 3
    response_text = None
    last_exception = None

    for attempt in range(1, max_retries + 1):
        try:
            print(f"Requesting content from Gemini API (Attempt {attempt}/{max_retries}, Model: '{model_name}')...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            if response and response.text and response.text.strip():
                response_text = response.text.strip()
                break
            else:
                raise ValueError("Received empty response from Gemini API.")
        except Exception as e:
            last_exception = e
            print(f"Attempt {attempt} failed: {e}", file=sys.stderr)
            if attempt < max_retries:
                time.sleep(2 * attempt)

    if not response_text:
        print(f"Fatal: Failed to generate content after {max_retries} retries. Error: {last_exception}", file=sys.stderr)
        sys.exit(1)

    cleaned_content = clean_markdown_output(response_text)

    if not cleaned_content:
        print("Fatal: Cleaned content is empty.", file=sys.stderr)
        sys.exit(1)

    # Save output to daily directory
    daily_dir = PROJECT_ROOT / "daily"
    daily_dir.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now().strftime("%Y-%m-%d")
    topic_slug = slugify(topic)
    file_path = daily_dir / f"{date_str}-{topic_slug}.md"

    file_path.write_text(cleaned_content + "\n", encoding="utf-8")
    print(f"SUCCESS: Created daily code file at '{file_path}'")

    # Update README table
    print("Rebuilding README.md table...")
    update_readme()


if __name__ == "__main__":
    generate_daily_code()
