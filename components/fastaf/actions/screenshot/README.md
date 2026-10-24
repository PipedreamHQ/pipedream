# Overview

Capture Screenshot uses the [FastAF REST API](https://fastaf.co/docs/#screenshot).

## Example Use Cases

Capture a public page for a visual monitoring workflow.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Set a public URL. Optionally choose full-page capture, viewport dimensions in pixels, PNG/JPG/WebP, quality and navigation readiness. Costs 5 credits.

## Output and Credits

Returns `{ filePath, contentType, bytes }` for a temporary image file, not base64. Consume or upload the file in a later step. Optional File Stash sync is supported through the directory prop.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
