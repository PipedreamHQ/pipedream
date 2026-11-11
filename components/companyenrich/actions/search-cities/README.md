# Search Cities

Search cities by a case-insensitive name substring. Returns one cursor page without consuming credits. Use returned codes or IDs in search filters.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-geo-cities).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

The action returns one page. To continue, pass its `nextCursor` with the same query or company; there is no automatic paging.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-geo-cities).
