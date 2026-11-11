# Overview

Retrieve 12-month pages of workforce history for a company ID or domain. Defaults to one page; increase **Maximum Pages** for earlier years at 5 credits per successful page. Pass nextCursor from this action or a workforce expansion to retrieve an earlier year for the same company.

# Example Use Cases

Compare workforce observations across selected years for an account.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Supply the action inputs using the examples in their descriptions. Advanced filters accept JSON objects from the [API reference](https://docs.companyenrich.com/reference/get_v2-companies-workforce).
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

Leave **Maximum Pages** at `1` to receive the original API page response. To follow cursors automatically, set it to `2`–`100`; the action returns `{ pages, nextCursor }`. Each `pages` entry preserves the full API response in order, including search scores or workforce history window metadata. Paging stops at the limit or when no cursor remains. Pass the final `nextCursor` with the same inputs to resume. Every paid page can consume additional credits.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/get_v2-companies-workforce).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.

If a cursor expires, begin again without a cursor. Keep all filters and expansions unchanged when continuing. A repeated cursor stops pagination before another request can repeat that page. If a later page fails, the action fails; rerunning it can charge again for earlier successful pages.
