# Overview

Scrape Page uses the [FastAF REST API](https://fastaf.co/docs/#scrape).

## Example Use Cases

Use this action to prepare public page content for a later processing step.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Set a public URL and choose HTML, markdown, links, images or summary. Leave rendering unset to preserve site defaults. Summary adds 10 credits.

## Output and Credits

One request to `/v1/scrape`. Text is returned as `{ content }`; JSON is returned unchanged.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
