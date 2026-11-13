# Overview

Enrich a company from its domain. Costs 1 credit when returned, plus selected paid expansions. With **Wait for Enrichment** set to false, an unstored company fails with HTTP 404 without consuming credits. Eligible misses may schedule background enrichment, but this action returns no pending result and does not retry automatically.

# Example Use Cases

Enrich a new CRM account from its website domain before assigning an owner.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Provide **Company Domain**, for example `stripe.com`. Optionally select **Company Expansions** and set **Wait for Enrichment**.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-companies-enrich).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
