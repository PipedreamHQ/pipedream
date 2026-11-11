# Enrich Company by Properties

Resolve a company from its name or social identifiers. Uses the best match; review identity before updating a CRM. Costs 1 credit when returned or when identifiers cannot resolve a domain, plus returned paid expansions.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-companies-enrich).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-companies-enrich).
