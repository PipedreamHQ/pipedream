# Overview

Preview up to 10 person summaries without consuming credits. Requires the corresponding preview capability on your plan. No pagination or paid expansions.

Company queries using `query`, keyword, technology, funding, workforce, `reportedEmployees`, or required-feature filters, or semantic or lookalike queries, match people at only the 1,000 best-matching companies.

# Example Use Cases

Inspect a limited sample of professional profiles before running a paid search.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Optionally supply **Person Filter** and **Employer Company Query** as JSON objects using the [API reference](https://docs.companyenrich.com/reference/post_v2-people-search-preview). Previews have no pagination or expansion inputs.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

Do not include pagination or paid expansions in the query. Preview access depends on the account plan even though it consumes no credits.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-people-search-preview).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
