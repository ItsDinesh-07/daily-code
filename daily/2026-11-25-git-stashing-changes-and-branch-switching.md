# Git: Stashing Changes and Branch Switching

This guide demonstrates how to save uncommitted work using `git stash`, switch branches safely, and restore your changes. It prevents common conflicts when moving between tasks.

```bash
# 1. Initialize a new Git repository and create a file
git init demo-repo
cd demo-repo
echo "Initial content" > file.txt
git add file.txt
git commit -m "Initial commit"

# 2. Create and switch to a new feature branch
git checkout -b feature-branch

# 3. Make some uncommitted changes that you aren't ready to commit yet
echo "Work in progress" >> file.txt

# 4. Stash the changes to clean your working directory
git stash save "WIP on feature-branch"

# 5. Switch back to the main branch safely
git checkout main

# 6. Do some work on main, then return to your feature branch
git checkout feature-branch

# 7. Restore (pop) your stashed changes back into the working directory
git stash pop

# 8. Verify your changes are back
cat file.txt
```

## Key takeaways
* `git stash` temporarily shelves uncommitted changes so you can work on something else.
* Always stash or commit your changes before switching branches to avoid merge conflicts or blocked checkouts.
* `git stash pop` applies the most recent stash to your working directory and removes it from the stash list.
