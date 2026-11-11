# Search People

Find professional profiles with person and employer filters. Ordinary search does not return emails; use **Find Work Email (Beta)** when needed. Costs 2 credits per person and a 2-credit minimum for empty results, plus paid education expansion. Returns one page, preserving order and nextCursor; no automatic pagination.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-people-search).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

The action returns one page. To continue, pass its `nextCursor` with the same query or company; there is no automatic paging.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-people-search).
