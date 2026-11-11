# Overview

Enrich 1–50 domains in one request. Costs 1 credit per unique returned company, plus paid expansions. Preserves found, not-found, invalid-domain and pending results; duplicate domains are enriched once.

# Example Use Cases

Enrich a batch of up to 50 account domains collected in a previous step.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-companies-enrich-batch).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-companies-enrich-batch).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
