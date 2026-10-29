# Overview

Extract Page Data uses the [FastAF REST API](https://fastaf.co/docs/#scrape).

## Example Use Cases

Extract page titles and product fields for a later workflow step.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Set a public URL and at least one of Extraction Prompt or Extraction Rules. Rules are a JSON object of extraction instructions, serialized to the API scalar string field.

## Output and Credits

Uses `/v1/scrape`, not an invented extraction endpoint. AI adds 10 credits once per request. Structured output is returned unchanged; text becomes `{ content }`.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
