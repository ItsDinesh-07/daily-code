<#
.SYNOPSIS
    Safe one-command Git push script for DailyCode.

.DESCRIPTION
    Safely stages, commits, pulls with rebase/autostash, and pushes changes to main.
    Prevents OneDrive locks (disables gc.auto locally), guards against committing
    node_modules, dist, .env, or large files (>10MB), and cleanly handles rejection
    due to cron or remote updates.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\scripts\safe_push.ps1 "feat: add feature"
    powershell -ExecutionPolicy Bypass -File .\scripts\safe_push.ps1
#>

param(
    [string]$CommitMessage = "chore: update"
)

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "chore: update"
}

# Step 1: Navigate to repository root (parent of scripts folder)
$ScriptFolder = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Definition }
if (-not $ScriptFolder) {
    $ScriptFolder = "."
}
$RepoRoot = Split-Path -Parent (Resolve-Path $ScriptFolder)
Set-Location $RepoRoot

git rev-parse --is-inside-work-tree > $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not inside a git repository." -ForegroundColor Red
    exit 1
}

$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne "main") {
    Write-Host "Error: Current branch is '$currentBranch', but safe_push only allows pushing from 'main'." -ForegroundColor Red
    exit 1
}

# Step 2: Disable git auto garbage collection locally to avoid OneDrive file locks
git config gc.auto 0
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Failed to set git config gc.auto 0." -ForegroundColor Yellow
}

# Step 3: Check git status
Write-Host "Checking git status..." -ForegroundColor Cyan
$statusLines = @(git status --short)
if ($statusLines.Count -eq 0) {
    Write-Host "Nothing to commit" -ForegroundColor Yellow
} else {
    Write-Host "Changes detected:" -ForegroundColor Cyan
    $statusLines | ForEach-Object { Write-Host "  $_" }

    # Step 4: Safety checks on what would be committed
    foreach ($line in $statusLines) {
        if ($line -match 'node_modules') {
            Write-Host "Safety check failed: node_modules detected in git status:" -ForegroundColor Red
            Write-Host "  $line" -ForegroundColor Red
            Write-Host "Aborting. Please verify .gitignore and ensure node_modules is ignored." -ForegroundColor Red
            exit 1
        }
        if ($line -match '(^|\s)dist(/|\\|$)') {
            Write-Host "Safety check failed: dist directory detected in git status:" -ForegroundColor Red
            Write-Host "  $line" -ForegroundColor Red
            Write-Host "Aborting. Production build artifacts should not be committed." -ForegroundColor Red
            exit 1
        }
        if ($line -match '\.env') {
            Write-Host "Safety check failed: .env file detected in git status:" -ForegroundColor Red
            Write-Host "  $line" -ForegroundColor Red
            Write-Host "Aborting. Environment files containing secrets must not be committed." -ForegroundColor Red
            exit 1
        }

        # Check for single changed files larger than 10 MB
        if ($line.Length -ge 3) {
            $rawPath = $line.Substring(3).Trim()
            if ($rawPath -match '->\s*(.+)$') {
                $rawPath = $Matches[1].Trim()
            }
            $cleanPath = $rawPath.Trim('"', "'")
            if (Test-Path -LiteralPath $cleanPath -PathType Leaf) {
                $item = Get-Item -LiteralPath $cleanPath
                if ($item.Length -gt 10MB) {
                    $sizeMB = [math]::Round($item.Length / 1MB, 2)
                    Write-Host "Safety check failed: File '$cleanPath' exceeds 10 MB ($sizeMB MB)." -ForegroundColor Red
                    Write-Host "Aborting. Large files must not be committed to Git." -ForegroundColor Red
                    exit 1
                }
            } elseif (Test-Path -LiteralPath $cleanPath -PathType Container) {
                $large = Get-ChildItem -LiteralPath $cleanPath -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 10MB } | Select-Object -First 1
                if ($large) {
                    $sizeMB = [math]::Round($large.Length / 1MB, 2)
                    Write-Host "Safety check failed: File '$($large.FullName)' exceeds 10 MB ($sizeMB MB)." -ForegroundColor Red
                    Write-Host "Aborting. Large files must not be committed to Git." -ForegroundColor Red
                    exit 1
                }
            }
        }
    }

    # Step 5: Stage and commit
    Write-Host "Staging changes (git add -A)..." -ForegroundColor Cyan
    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: git add -A failed with exit code $LASTEXITCODE." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Committing with message: '$CommitMessage'..." -ForegroundColor Cyan
        git commit -m $CommitMessage
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: git commit failed with exit code $LASTEXITCODE." -ForegroundColor Red
            exit $LASTEXITCODE
        }
    } else {
        Write-Host "Nothing staged to commit." -ForegroundColor Yellow
    }
}

# Step 6: Pull with rebase and autostash
Write-Host "Pulling latest changes (git pull --rebase --autostash)..." -ForegroundColor Cyan
git pull --rebase --autostash
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: git pull --rebase --autostash encountered conflicts or errors." -ForegroundColor Red
    $conflicts = @(git diff --name-only --diff-filter=U)
    if ($conflicts.Count -gt 0) {
        Write-Host "Conflicting files:" -ForegroundColor Red
        $conflicts | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    }
    Write-Host "To safely abort this rebase and return to your previous state, run:" -ForegroundColor Yellow
    Write-Host "    git rebase --abort" -ForegroundColor White
    exit 1
}

# Step 7: Push changes with automatic single rebase retry on rejection
Write-Host "Pushing changes to origin/main..." -ForegroundColor Cyan
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push rejected or failed (remote may have new commits). Attempting rebase and push retry..." -ForegroundColor Yellow
    git pull --rebase --autostash
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Retry git pull --rebase --autostash failed." -ForegroundColor Red
        $conflicts = @(git diff --name-only --diff-filter=U)
        if ($conflicts.Count -gt 0) {
            Write-Host "Conflicting files:" -ForegroundColor Red
            $conflicts | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        }
        Write-Host "To safely abort this rebase, run:" -ForegroundColor Yellow
        Write-Host "    git rebase --abort" -ForegroundColor White
        exit 1
    }

    Write-Host "Pushing again after rebase..." -ForegroundColor Cyan
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: git push failed after retry. Please check network or remote permissions." -ForegroundColor Red
        exit 1
    }
}

# Step 8: Show recent commits
Write-Host "`nLast 3 commits:" -ForegroundColor Green
git log -3 --oneline
Write-Host "`nDone" -ForegroundColor Green
