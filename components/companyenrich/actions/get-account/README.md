# Get Account

Read your account credit usage and capabilities without consuming credits. Returns only account ID, credit information and capabilities; credentials are omitted. Use this to check preview availability before running preview actions.

## Use

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/get_v2-me).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-me).
