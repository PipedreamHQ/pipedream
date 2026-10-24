# Overview

Search News uses the [FastAF REST API](https://fastaf.co/docs/#news).

## Example Use Cases

Monitor public headlines for a topic.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Enter a query; optionally set country, language, zero-based page, result limit or a time expression such as `qdr:d`.

## Output and Credits

One structured news-results page, at 5 credits. The result limit does not automatically fetch additional pages.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
