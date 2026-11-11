# Overview

Retrieve a company by its ID from **Search Companies** or **Autocomplete Companies**. Costs 1 credit when returned, plus selected paid expansions.

# Example Use Cases

Refresh a saved CompanyEnrich company record using its existing ID.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Provide the **Company ID** returned by **Search Companies** or **Enrich Company**. Optionally select **Company Expansions**.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-companies-companyid).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
