# Overview

Count matching people without consuming credits. Returns both count (accessible under your plan) and total (before plan limits). No pagination or expansions.

Company queries using `query`, keyword, technology, funding, workforce, `reportedEmployees`, or required-feature filters, or semantic or lookalike queries, match people at only the 1,000 best-matching companies.

# Example Use Cases

Estimate a professional audience before retrieving paid profile results.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Optionally supply **Person Filter** and **Employer Company Query** as JSON objects using the [API reference](https://docs.companyenrich.com/reference/post_v2-people-search-count). Counts have no pagination or expansion inputs.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

The response keeps both plan-accessible `count` and pre-limit `total`; do not treat them as interchangeable.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-people-search-count).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
