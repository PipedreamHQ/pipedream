# Tool Annotations Script

Applies MCP (Model Context Protocol) annotations to Pipedream action files from CSV data.

## Usage

```bash
# Test with first 10 entries
node apply-annotations.js --csv registry-actions-claude-2025-09-29.csv --limit 10

# Process in batches
node apply-annotations.js --csv registry-actions-claude-2025-09-29.csv --offset 0 --limit 100
node apply-annotations.js --csv registry-actions-claude-2025-09-29.csv --offset 100 --limit 100

# Process all
node apply-annotations.js --csv registry-actions-claude-2025-09-29.csv
```

## What it does

1. Reads CSV with action keys and annotation values
2. Finds corresponding action files in `../../components/*/actions/`
3. Adds `annotations` object after the `version` field
4. Increments patch version (e.g., "0.1.5" → "0.1.6")

## Options

- `--verbose` - Detailed logging
- `--limit N` - Process only N entries
- `--offset N` - Skip N entries before processing
