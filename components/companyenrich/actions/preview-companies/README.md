# Overview

Preview up to 25 company summaries without consuming credits. Requires the corresponding preview capability on your plan. No pagination or paid expansions.

# Example Use Cases

Inspect a sample of an account segment before retrieving full company records.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-companies-search-preview).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

Do not include pagination or paid expansions in the query. Preview access depends on the account plan even though it consumes no credits.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-companies-search-preview).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
