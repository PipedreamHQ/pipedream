# Overview

Search Maps uses the [FastAF REST API](https://fastaf.co/docs/#maps).

## Example Use Cases

Find places matching a public location search.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Supply a search query or place ID. Use a place name or coordinates for the search centre, not both. Coordinates use `@latitude,longitude,zoom`.

## Output and Credits

Costs 5 credits. Search and place-detail response shapes differ. Page is an offset: 0, 20, 40, up to 100; supply coordinates for pagination.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
