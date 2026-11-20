# Overview

Find up to 10 positions suggestions for search filters. Does not consume credits. Empty query returns an empty list.

# Example Use Cases

Find job-title suggestions for a professional profile search.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Enter a position prefix in **Query**, for example `engineer`. An empty query returns no suggestions.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-positions-autocomplete).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
