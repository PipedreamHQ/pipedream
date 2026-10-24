# Overview

Search Web uses the [FastAF REST API](https://fastaf.co/docs/#serp).

## Example Use Cases

Monitor public search results in a scheduled workflow.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Enter a search query. Optional page is zero-based; results limits the returned page and does not fetch additional pages. Advanced search raises the price from 5 to 10 credits.

## Output and Credits

One structured SERP response with organic results and other available sections. Pagination is explicit to control credit spending.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
