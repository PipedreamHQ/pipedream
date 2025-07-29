# Create Package Validation Issue Action

This GitHub Action creates or updates issues when package validation failures are detected in the Pipedream repository.

## Features

- ✅ **Smart Issue Management**: Creates new issues or updates existing ones for the same day
- 📊 **Rich Reporting**: Includes detailed summaries, failure categories, and quick action commands
- 🔄 **Fallback Support**: Works with both JSON and text validation reports
- 🏷️ **Auto-labeling**: Automatically applies appropriate labels for organization
- 📈 **Failure Analysis**: Groups failures by category for easier debugging

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | ✅ | - |
| `validation-report-json` | Path to JSON validation report | ✅ | `validation-report.json` |
| `validation-report-txt` | Path to text validation report | ❌ | `validation-report.txt` |
| `workflow-run-number` | GitHub workflow run number | ✅ | - |
| `workflow-run-id` | GitHub workflow run ID | ✅ | - |
| `server-url` | GitHub server URL | ✅ | - |
| `repository` | Repository name (owner/repo) | ✅ | - |

## Outputs

| Output | Description | Example |
|--------|-------------|---------|
| `issue-created` | Whether a new issue was created | `true`/`false` |
| `issue-updated` | Whether an existing issue was updated | `true`/`false` |
| `issue-url` | URL of the created/updated issue | `https://github.com/...` |
| `failed-count` | Number of failed packages | `42` |

**Note**: All outputs are properly set for both regular and composite actions, supporting `core.setOutput()` and `$GITHUB_OUTPUT` file methods.

## Usage

```yaml
- name: Create Issue on Failures
  if: steps.check_failures.outputs.failed_count != '0'
  uses: ./.github/actions/create-package-validation-issue
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    validation-report-json: 'validation-report.json'
    validation-report-txt: 'validation-report.txt'  # optional
    workflow-run-number: ${{ github.run_number }}
    workflow-run-id: ${{ github.run_id }}
    server-url: ${{ github.server_url }}
    repository: ${{ github.repository }}
```

## Issue Format

The action creates issues with:

### 📦 Title Format
```
📦 Package Validation Report - [Date] - [X] failures
```

### 📋 Content Sections
1. **Summary**: Overview statistics of validation results
2. **Links**: Direct links to workflow run and artifacts
3. **Failed Packages**: List of top failing packages with error types
4. **Failure Categories**: Grouped failures by validation type
5. **Next Steps**: Action items for developers
6. **Quick Commands**: Copy-paste commands for local testing

### 🏷️ Auto-applied Labels
- `package-validation`: Identifies validation-related issues
- `automated`: Marks as automatically created
- `bug`: Indicates packages needing fixes

## Behavior

### New Issues
- Creates a new issue if no open validation issue exists for the current date
- Applies appropriate labels automatically

### Existing Issues
- Updates existing issues with new validation results as comments
- Avoids creating duplicate issues for the same day
- Maintains issue history through comments

### No Failures
- Skips issue creation when no validation failures are detected
- Sets output flags appropriately for workflow logic

## Error Handling

- **JSON Parse Errors**: Falls back to text report parsing
- **Missing Files**: Gracefully handles missing report files
- **API Failures**: Provides detailed error messages for debugging
- **Network Issues**: Fails gracefully with actionable error messages

## Development

### Local Testing
```bash
# Install dependencies
cd .github/actions/create-package-validation-issue
npm install

# Test with sample data
node test/test-action.js
```

### Dependencies
- `@actions/core`: GitHub Actions toolkit for inputs/outputs
- `@actions/github`: GitHub API client and context

### Technical Notes
- **Composite Action**: Uses `composite` action type to handle dependency installation automatically
- **Auto-Install**: Dependencies are installed during action execution for reliability
- **Path Resolution**: File paths are resolved relative to the GitHub workspace
- **Fallback Support**: Gracefully handles missing files and parse errors

## Integration

This action is designed to work with:
- `scripts/generate-package-report.js`: Validation report generator
- `.github/workflows/scheduled-package-validation.yaml`: Scheduled validation workflow
- Pipedream component validation pipeline

## Example Issue Output

```markdown
# 📦 Scheduled Package Validation Report - Mon Jan 15 2024

📊 **Summary:**
- Total Components: 2932
- ✅ Validated: 2847
- ❌ Failed: 85
- ⏭️ Skipped: 1250
- 📈 Publishable: 2932
- 📉 Failure Rate: 2.90%

## 🔗 Links
- **Workflow Run**: [#123](https://github.com/org/repo/actions/runs/456)
- **Download Reports**: Check the workflow artifacts for detailed reports

## ❌ Failed Packages
- **@pipedream/netlify** (netlify): import, dependencies
- **@pipedream/google-slides** (google_slides): mainFile
- ... and 83 more packages

## Next Steps
1. Review the failed packages listed above
2. Check the full validation report artifact
3. Fix import/dependency issues in failing packages
...
```