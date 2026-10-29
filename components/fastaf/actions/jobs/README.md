# Overview

Search Jobs uses the [FastAF REST API](https://fastaf.co/docs/#jobs).

## Example Use Cases

Monitor public job listings for a role and location.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Enter a job query. Jobs language uses a locale such as `en_us`. Supply a next-page token from a prior response to continue with the same query and filters.

## Output and Credits

One structured jobs-results page, at 5 credits. No automatic pagination or retries; additional executions spend credits.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.
