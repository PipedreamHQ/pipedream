# Overview

Retrieve country metadata using a two-letter code from **Search Countries**. Does not consume credits.

# Example Use Cases

Retrieve country metadata for a code returned from Search Countries.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Provide a two-letter **Country Code**, for example `US`, from **Search Countries**.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-geo-countries-countrycode).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
