# Git: Interactive Rebasing and Squashing Commits

Interactive rebasing allows you to rewrite commit history by combining (squashing), editing, or reordering commits. This keeps your project's commit history clean and meaningful before merging.

```bash
#!/bin/bash
# =================================================================0
# Git Interactive Rebasing and Squashing Example
# =================================================================

# 1. Initialize a new Git repository
git init demo-repo && cd demo-repo

# 2. Create initial commits that we will later squash together
echo "Hello" > file.txt
git add file.txt
git commit -m "feat: add initial file"

echo "World" >> file.txt
git add file.txt
git commit -m "fix typo in file"

echo "!" >> file.txt
git add file.txt
git commit -m "fix another typo"

# 3. View the current commit history (3 commits)
echo "--- Before Rebase ---"
git log --oneline

# 4. Perform an interactive rebase of the last 3 commits.
# Note: In an automated script, we use GIT_SEQUENCE_EDITOR to simulate 
# changing 'pick' to 'squash' (or 's') for the last two commits.
# In a real terminal, running 'git rebase -i HEAD~3' opens your text editor.
export GIT_SEQUENCE_EDITOR="sed -i 's/^pick/squash/'"
git rebase -i HEAD~3

# 5. View the cleaned-up commit history (now squashed into 1 commit)
echo "--- After Rebase ---"
git log --oneline

# Cleanup the demo repository
cd .. && rm -rf demo-repo
```

## Key takeaways
* Use `git rebase -i HEAD~N` to interactively modify the last $N$ commits.
* Change `pick` to `squash` (or `s`) in the interactive editor to merge a commit into the one above it.
* Squashing helps maintain a clean, linear history by combining WIP (work-in-progress) commits into a single, cohesive feature commit.
