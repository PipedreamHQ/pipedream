# Overview

Search cities by a case-insensitive name substring. Fetches up to **Maximum Pages** without consuming credits; defaults to one page. Use returned codes or IDs in search filters.

# Example Use Cases

Find city IDs to narrow an account search to a location.

# Getting Started

1. Connect a CompanyEnrich account through the Pipedream app connection. See [connection setup](../../README.md#connection).
2. Optionally set a name substring in **Query**, two-letter **Country Codes** from **Search Countries**, or **State IDs** from **Search States**. Set **Page Size**, **Maximum Pages**, and **Cursor** to control pagination.
3. Run the action once and use the returned data in the next step. Provider errors are returned as errors, not empty successful results.

Leave **Maximum Pages** at `1` to receive the original API page response. To follow cursors automatically, set it to `2`–`100`; the action returns `{ pages, nextCursor }`. Each `pages` entry preserves the full API response in order, including geographic items and metadata. Paging stops at the page limit, the end of results, or a 20-second budget for collecting multiple pages. Pass the final `nextCursor` with the same inputs to resume. These geographic lookups do not consume CompanyEnrich credits.

When the time budget expires after a completed page, the result also contains `partial: true` and `stoppedReason: "time_budget"`. Resume with its `nextCursor` and the same inputs. The action cancels any in-flight request at that limit; if no page completed, it throws an error. These lookups remain free of CompanyEnrich credit charges. Single-page mode is unchanged.

See [shared credit and pagination controls](../../README.md#search-and-credit-controls) and the [endpoint documentation](https://docs.companyenrich.com/reference/post_v2-geo-cities).

# Troubleshooting

A 401 response means the connected API key needs checking. For credit or capability errors, use **Get Account** to inspect the account and review the endpoint requirements. The action returns provider errors without automatically retrying.

If a cursor expires, begin again without a cursor. Keep all filters and expansions unchanged when continuing. A repeated cursor stops pagination before another request can repeat that page. If a later page fails, the action fails; rerunning it repeats earlier requests. Geographic lookups remain free of CompanyEnrich credit charges.

Multi-page mode exports `paginationProgress` after each completed page, including the pages and continuation cursor. This snapshot can help inspect a failed run, but it is not a durable checkpoint and may be unavailable after a hard workflow timeout. Allow enough workflow execution time, including time used by earlier steps. For recovery across runs, process one page at a time and save the page and cursor to durable storage before continuing.
