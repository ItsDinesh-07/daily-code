# Practice Exercises: Git: Stashing Changes and Branch Switching
Practice temporarily saving uncommitted work and safely navigating between branches without losing progress.

## Exercise 1: Basic Stash and Switch
**Problem Task:** You are halfway through editing `index.html` on the `main` branch, but you urgently need to switch to the `hotfix` branch to fix a typo. Stash your changes, switch branches, and return.

**Scenario:**
```bash
echo "Unfinished feature" >> index.html
git status
```

**Solution Snippet:**
```bash
git stash
git checkout hotfix
# Do your hotfix work, then return:
git checkout main
git stash pop
```

## Exercise 2: Stashing with a Descriptive Message
**Problem Task:** You have modifications in multiple files. Create a stash with a custom message so you can easily identify it later before switching to a new feature branch.

**Scenario:**
```bash
echo "Draft feature" > feature.txt
git add feature.txt
```

**Solution Snippet:**
```bash
git stash save "Work in progress on draft feature"
git checkout -b feature/new-login
git stash list
```

## Exercise 3: Resolving Stash Conflicts
**Problem Task:** You modified `README.md` and stashed it. Someone else updated `README.md` on `main` in the meantime. Apply your stash back to `main` and handle the resulting conflict.

**Scenario:**
```bash
# Assume README.md was modified and stashed earlier
git stash apply
```

**Expected Output / Solution Snippet:**
```
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
To resolve:
1. Open README.md and fix conflict markers (<<<<, ====, >>>>)
2. git add README.md
3. git stash drop
```

## Self-Check Checklist
- [ ] I know how to save uncommitted changes quickly using `git stash`.
- [ ] I can list and apply specific stashes when working with multiple saved states.
- [ ] I understand how to use `git stash pop` vs `git stash apply`.
- [ ] I can safely switch branches while keeping my working directory clean.
