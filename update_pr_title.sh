#!/bin/bash
set -euo pipefail

# Error handling
trap 'echo "Error on line $LINENO"; exit 1' ERR

# Configuration
PR_BRANCH="update-pr-title"
PR_TITLE="feat: Add SageCRMClient for API integration and ticket management"

# Setup git
setup_git() {
    echo "Setting up git..."
    git config --global user.name "GitHub Actions"
    git config --global user.email "actions@github.com"
    git config --global --add safe.directory /github/workspace
    
    # Get the repository URL from environment or use default
    if [ -z "${GITHUB_REPOSITORY:-}" ]; then
        echo "Error: GITHUB_REPOSITORY environment variable not set"
        exit 1
    fi
    
    # Set remote URL with token if available
    if [ -n "${GITHUB_TOKEN:-}" ]; then
        git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
    fi
    
    git fetch origin
}

# Clean up existing branch
cleanup_branch() {
    echo "Cleaning up existing branch if it exists..."
    # Delete local branch if it exists
    if git show-ref --verify --quiet "refs/heads/${PR_BRANCH}"; then
        git checkout -q main
        git branch -D "${PR_BRANCH}" || true
    fi
    
    # Delete remote branch if it exists
    if git ls-remote --exit-code --heads origin "${PR_BRANCH}" >/dev/null 2>&1; then
        git push origin --delete "${PR_BRANCH}" 2>/dev/null || true
    fi
}

# Create or update PR
update_pr() {
    echo "Creating/updating PR..."
    
    # Create or update branch
    git checkout -b "${PR_BRANCH}" 2>/dev/null || git checkout -B "${PR_BRANCH}"
    
    # Make an empty commit to trigger PR update
    git commit --allow-empty -m "docs: update PR title and description"
    
    # Push changes
    git push -f origin "${PR_BRANCH}"
    
    # Check if PR already exists
    local existing_pr
    existing_pr=$(gh pr list --head "${PR_BRANCH}" --json number -q '.[0].number' 2>/dev/null || echo "")
    
    if [ -n "$existing_pr" ]; then
        echo "Updating existing PR #${existing_pr}"
        gh pr edit "$existing_pr" --title "${PR_TITLE}" --body "$(cat PR_DESCRIPTION.md)"
    else
        echo "Creating new PR"
        gh pr create \
            --title "${PR_TITLE}" \
            --body "$(cat PR_DESCRIPTION.md)" \
            --base main \
            --head "${PR_BRANCH}"
    fi
}

# Main execution
main() {
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        echo "Error: GitHub CLI (gh) is not installed"
        exit 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "Error: Not in a git repository"
        exit 1
    fi
    
    setup_git
    cleanup_branch
    update_pr
    
    echo "PR update completed successfully"
}

# Run main function
main "$@"
