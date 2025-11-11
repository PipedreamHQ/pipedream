#!/bin/bash
# Update PR title
git config --global user.name "GitHub Actions"
git config --global user.email "actions@github.com"

git checkout -b update-pr-title
git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git

git config --global --add safe.directory /github/workspace
git fetch origin

git commit --allow-empty -m "docs: update PR title and description"

git push -u origin update-pr-title

# Create PR with new title
gh pr create \
  --title "feat: Add SageCRMClient for API integration and ticket management" \
  --body "$(cat PR_DESCRIPTION.md)" \
  --base main \
  --head update-pr-title
