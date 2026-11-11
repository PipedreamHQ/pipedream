# Overview

Resolve a work email for a person from **Search People**. Beta: provider behavior may change. Costs 10 credits for a newly accessed found email. Returns found, not-found, unavailable or pending without automatic polling; an email is present only when found.

# Example Use Cases

Request work-email resolution for a person selected from Search People.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/get_v2-people-personid-email).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-people-personid-email).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
