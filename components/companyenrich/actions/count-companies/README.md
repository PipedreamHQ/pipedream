# Count Companies

Count matching companies without consuming credits. Returns both count (accessible under your plan) and total (before plan limits). No pagination or expansions.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-companies-search-count).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

The response keeps both plan-accessible `count` and pre-limit `total`; do not treat them as interchangeable.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-companies-search-count).
