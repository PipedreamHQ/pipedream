# Enrich Company

Enrich a company from its domain. Costs 1 credit when returned, plus selected paid expansions. On-demand enrichment can return a pending miss; no automatic retry is made.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/get_v2-companies-enrich).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-companies-enrich).
