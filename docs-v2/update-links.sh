#!/bin/bash

# Script to update relative links in docs-v2 files after directory restructuring

echo "Updating links from '/workflows/contributing' to '/contributing'"
grep -r --include="*.mdx" --include="*.tsx" "/workflows/contributing" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|/workflows/contributing|/contributing|g'

echo "Updating links from '/workflows/projects' to '/projects'"
grep -r --include="*.mdx" --include="*.tsx" "/workflows/projects" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|/workflows/projects|/projects|g'

echo "Updating links from '/workflows/workspaces' to '/workspaces'"
grep -r --include="*.mdx" --include="*.tsx" "/workflows/workspaces" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|/workflows/workspaces|/workspaces|g'

# Handle relative paths (../workflows/contributing, ../../workflows/contributing, etc.)
echo "Updating relative links to 'workflows/contributing'"
grep -r --include="*.mdx" --include="*.tsx" "\.\./workflows/contributing" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./workflows/contributing|\.\./contributing|g'
grep -r --include="*.mdx" --include="*.tsx" "\.\./\.\./workflows/contributing" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./\.\./workflows/contributing|\.\./\.\./contributing|g'

echo "Updating relative links to 'workflows/projects'"
grep -r --include="*.mdx" --include="*.tsx" "\.\./workflows/projects" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./workflows/projects|\.\./projects|g'
grep -r --include="*.mdx" --include="*.tsx" "\.\./\.\./workflows/projects" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./\.\./workflows/projects|\.\./\.\./projects|g'

echo "Updating relative links to 'workflows/workspaces'"
grep -r --include="*.mdx" --include="*.tsx" "\.\./workflows/workspaces" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./workflows/workspaces|\.\./workspaces|g'
grep -r --include="*.mdx" --include="*.tsx" "\.\./\.\./workflows/workspaces" /Users/dannyroosevelt/code/pipedream/docs-v2/pages | cut -d: -f1 | sort | uniq | xargs sed -i '' 's|\.\./\.\./workflows/workspaces|\.\./\.\./workspaces|g'

echo "Link updates complete!"