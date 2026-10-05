# 🚀 Daily Code Automation

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

## 📚 Daily Code Index (Total: 8)

| Date | Topic | Link |
| :--- | :--- | :--- |
| `2026-10-05` | Java Collections: HashSet and Custom Equals/HashCode | [View Code Snippet](daily/2026-10-05-java-collections-hashset-and-custom-equals-hashcod.md) |
| `2026-10-04` | Java PriorityQueue as a Min-Heap | [View Code Snippet](daily/2026-10-04-java-collections-priorityqueue-and-min-heap.md) |
| `2026-10-03` | Java HashMap: Internal Mechanics and Usage | [View Code Snippet](daily/2026-10-03-java-collections-hashmap-internal-mechanics-and-us.md) |
| `2026-10-02` | Java Collections: ArrayList vs LinkedList Performance | [View Code Snippet](daily/2026-10-02-java-collections-arraylist-vs-linkedlist-performan.md) |
| `2026-10-01` | Java OOP: Polymorphism in Action | [View Code Snippet](daily/2026-10-01-java-oop-polymorphism-in-action.md) |
| `2026-09-30` | Java Encapsulation and Access Modifiers | [View Code Snippet](daily/2026-09-30-java-oop-encapsulation-and-access-modifiers.md) |
| `2026-09-29` | Java OOP: Interfaces and Abstract Classes | [View Code Snippet](daily/2026-09-29-java-oop-interfaces-and-abstract-classes.md) |
| `2026-09-28` | Java OOP: Inheritance and Method Overriding | [View Code Snippet](daily/2026-09-28-java-oop-inheritance-and-method-overriding.md) |

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
