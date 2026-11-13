# Overview

Find the best matching person for a known work email. This is reverse email resolution, not email discovery. Costs 5 credits when found, plus 1 for education if requested. Review the match before updating records.

# Example Use Cases

Resolve a known work email to a professional profile for an incoming lead.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Provide a **Work Email**, for example `person@example.com`. Optionally select **Person Expansions**.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-people-enrich).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.
