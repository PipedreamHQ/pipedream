# Get Company Workforce

Retrieve one 12-month page of workforce history for a company ID or domain. Costs 5 credits per successful page. Pass nextCursor from this action or a workforce expansion to retrieve an earlier year for the same company.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/get_v2-companies-workforce).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

The action returns one page. To continue, pass its `nextCursor` with the same query or company; there is no automatic paging.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-companies-workforce).
