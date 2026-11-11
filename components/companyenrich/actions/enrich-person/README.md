# Enrich Person by Email

Find the best matching person for a known work email. This is reverse email resolution, not email discovery. Costs 5 credits when found, plus 1 for education if requested. Review the match before updating records.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/post_v2-people-enrich).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-people-enrich).
