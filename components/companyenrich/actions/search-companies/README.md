# Overview

Search companies using structured filters, a semantic query, or lookalike seeds. Standard, semantic and lookalike searches cost 1, 2 and 5 credits per company respectively; an empty result costs one base result, plus expansions when returned. Fetches up to **Maximum Pages**, preserving each page and its cursor. Defaults to one page.

# Example Use Cases

Build an account shortlist from industry filters, a product description or seed company domains.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Optionally supply **Company Filter**, **Semantic Query**, or **Lookalike Query** as JSON objects using the [API reference](https://docs.companyenrich.com/reference/post_v2-companies-search). Semantic and lookalike queries cannot be combined. Select any **Company Expansions**, then set **Page Size**, **Maximum Pages**, and **Cursor** to control pagination.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

Leave **Maximum Pages** at `1` to receive the original API page response. To follow cursors automatically, set it to `2`–`100`; the action returns `{ pages, nextCursor }`. Each `pages` entry preserves the full API response in order, including search scores or workforce history window metadata. Paging stops at the page limit, the end of results, or a 20-second budget for collecting multiple pages. Pass the final `nextCursor` with the same inputs to resume. Every paid page can consume additional credits.

When the time budget expires after a completed page, the result also contains `partial: true` and `stoppedReason: "time_budget"`. Resume with its `nextCursor` and the same inputs. The action cancels any in-flight request at that limit; if no page completed, it throws an error. An aborted paid request may still consume credits. Single-page mode is unchanged.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-companies-search).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.

If a cursor expires, begin again without a cursor. Keep all filters and expansions unchanged when continuing. A repeated cursor stops pagination before another request can repeat that page. If a later page fails, the action fails; rerunning it can charge again for earlier successful pages.

Multi-page mode exports `paginationProgress` after each completed page, including the pages and continuation cursor. This snapshot can help inspect a failed run, but it is not a durable checkpoint and may be unavailable after a hard workflow timeout. Allow enough workflow execution time, including time used by earlier steps. For recovery across runs, process one page at a time and save the page and cursor to durable storage before continuing.
