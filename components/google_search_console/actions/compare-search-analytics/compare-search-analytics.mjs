import googleSearchConsole from "../../google_search_console.app.mjs";
import {
  buildComparison, formatPctChange,
} from "../../common/compare.mjs";
import { buildDimensionFilterGroups } from "../../common/filters.mjs";
import { trimIfString } from "../../common/utils.mjs";

// Rows fetched per period before the join. Deltas need the full set on both sides, so this
// is deliberately much larger than the `rowLimit` the caller sees.
const INTERNAL_ROW_LIMIT = 5000;
const DEFAULT_ROW_LIMIT = 50;

export default {
  name: "Compare Search Analytics",
  description: "Compare Google Search Console traffic between two date ranges for one property and "
    + "return the deltas. Fetches both periods in parallel, joins the rows on their dimension keys, and "
    + "reports per-row and total `clicks`, `impressions`, `ctr` and `position` change — the "
    + "period-over-period arithmetic is done for you."
    + "\n\n**Use for** any question that compares two date ranges: month over month, quarter over "
    + "quarter, year over year, \"which queries gained or lost the most clicks\", \"did mobile grow\", "
    + "\"did that update hurt us\". Use **Query Search Analytics** for a single date range, for paging "
    + "past 5000 rows, and for the `hour` and `searchAppearance` dimensions this tool does not accept. "
    + "Property-level vs page-level position questions also need two **Query Search Analytics** calls "
    + "with different `aggregationType` values."
    + "\n\n**Returns** `{ current_period, previous_period, totals, rows, row_count, has_more, "
    + "truncated, note }`. `totals` carries `current`, `previous`, `delta` and `pct_change` for the "
    + "whole period, computed from every fetched row rather than just the returned ones. Each row is "
    + "`{ keys, current, previous, delta, pct_change }`."
    + "\n\n**Reading the deltas.** A key present in only one period gets zeros for the other, so new "
    + "and lost queries both show up — but its `delta.ctr` and `delta.position` are `null`, because the "
    + "missing period has no CTR or position to compare against (`delta.clicks` and "
    + "`delta.impressions` are still real numbers). `pct_change` is `null` where the previous period was "
    + "zero — not 0 and not infinity. `ctr` is a 0-1 fraction (`0.1428` means 14.3%) and `position` is "
    + "1-indexed where lower is better, so a NEGATIVE position delta is an improvement; both are "
    + "impression-weighted, so never re-average them across rows. Query rows always understate the "
    + "real total because Google omits anonymized (rare) queries — compare with no dimensions, or by "
    + "`date`, for true totals. `truncated` is true when either period hit the internal 5000-row cap, "
    + "so rows and totals may be incomplete: narrow the range or add a filter. `has_more` is a "
    + "different signal — it only means the join produced more rows than `rowLimit`. `note` warns about "
    + "anonymized queries when relevant, otherwise it is `null`."
    + "\n\n**Mistakes.** \"The previous period\" means the same number of days immediately before the "
    + "current period: for 2026-08-01..2026-08-28 (28 days) that is 2026-07-04..2026-07-31. \"The same "
    + "period last year\" means both dates shifted back one year. Grouping Discover by `query` returns "
    + "a 400 — Discover has no `query` dimension. Comparing a range that ends today makes the current "
    + "period look artificially low, because data is final only after about 2-3 days unless `dataState` "
    + "is `all`. `filterValue` (with `filterDimension`/`filterOperator`) is applied identically to both "
    + "periods and wins over `advancedDimensionFilters`; the equivalent prop on **Query Search "
    + "Analytics** is named `subdomainFilter` for backwards compatibility."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, `currentStartDate=\"2026-08-01\"`, "
    + "`currentEndDate=\"2026-08-28\"`, `previousStartDate=\"2026-07-04\"`, "
    + "`previousEndDate=\"2026-07-31\"`, `dimensions=[\"query\"]`, `sortBy=\"clicks_delta\"` returns "
    + "`totals: { current: { clicks: 74, ... }, previous: { clicks: 68, ... }, delta: { clicks: 6, "
    + "... }, pct_change: { clicks: 0.0882, ... } }` and rows such as `{ keys: [\"example brand\"], "
    + "current: { clicks: 41, ... }, previous: { clicks: 33, ... }, delta: { clicks: 8, ... } }`."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)",
  key: "google_search_console-compare-search-analytics",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleSearchConsole,
    siteUrl: {
      propDefinition: [
        googleSearchConsole,
        "siteUrl",
      ],
    },
    currentStartDate: {
      type: "string",
      label: "Current Period Start Date (YYYY-MM-DD)",
      description: "First day of the RECENT period, inclusive, in `YYYY-MM-DD` **Pacific Time** — e.g. `2026-08-01`.",
    },
    currentEndDate: {
      type: "string",
      label: "Current Period End Date (YYYY-MM-DD)",
      description: "Last day of the RECENT period, inclusive — e.g. `2026-08-28`. Data is final only after 2-3 days, so avoid ending on today unless `dataState` is `all`.",
    },
    previousStartDate: {
      type: "string",
      label: "Previous Period Start Date (YYYY-MM-DD)",
      description: "First day of the BASELINE period, inclusive. For \"the previous period\" use the same number of days immediately before the current one — for 2026-08-01..2026-08-28 that is `2026-07-04`. For \"the same period last year\", shift `currentStartDate` back a year: `2025-08-01`.",
    },
    previousEndDate: {
      type: "string",
      label: "Previous Period End Date (YYYY-MM-DD)",
      description: "Last day of the BASELINE period, inclusive. For \"the previous period\" it is the day before `currentStartDate` — for a current period starting 2026-08-01 that is `2026-07-31`. For \"the same period last year\", shift `currentEndDate` back a year.",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      optional: true,
      description: "How to group the compared rows; each row's `keys` lines up positionally with this list. Leave empty to compare one totals row per period — the right choice for \"how did traffic change overall\". Use `query` for which queries gained or lost, `page` for page-level movement, `device` for mobile vs desktop, `country` for market shifts, `date` for a day-by-day pair-up. `hour` and `searchAppearance` are not supported here — use **Query Search Analytics**.",
      options: [
        "query",
        "page",
        "country",
        "device",
        "date",
      ],
    },
    searchType: {
      propDefinition: [
        googleSearchConsole,
        "searchType",
      ],
    },
    dataState: {
      type: "string",
      label: "Data State",
      description: "Which data to include, applied to both periods. `final` (default) returns only finalized data, which lags roughly 2-3 days. `all` also includes the most recent, not-yet-final days — use it only when the user explicitly wants recent or partial numbers; it makes a current period ending today look incomplete rather than absent.",
      optional: true,
      options: [
        "final",
        "all",
      ],
      default: "final",
    },
    filterDimension: {
      propDefinition: [
        googleSearchConsole,
        "filterDimension",
      ],
    },
    filterOperator: {
      propDefinition: [
        googleSearchConsole,
        "filterOperator",
      ],
    },
    filterValue: {
      type: "string",
      label: "Filter Value",
      optional: true,
      description: "The value to filter both periods on, combined with `filterDimension` and `filterOperator` into one filter — e.g. `filterDimension: device`, `filterOperator: equals`, value `MOBILE`. `page` expressions match the FULL URL, scheme and host included, not a path. When this is set, `advancedDimensionFilters` is ignored.",
    },
    advancedDimensionFilters: {
      propDefinition: [
        googleSearchConsole,
        "advancedDimensionFilters",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "How to order the returned rows; defaults to `clicks_delta`. The `*_delta` options sort by ABSOLUTE change, so the biggest gains and losses both appear at the top — read the sign of `delta` to tell them apart. Under `ctr_delta` and `position_delta`, rows whose delta is `null` (a key present in only one period) sort last, so use `clicks_delta` to surface new and lost queries. `current_clicks` sorts by current-period clicks descending — right for \"top queries, with their change\".",
      optional: true,
      options: [
        "clicks_delta",
        "impressions_delta",
        "ctr_delta",
        "position_delta",
        "current_clicks",
      ],
      default: "clicks_delta",
    },
    rowLimit: {
      type: "integer",
      label: "Max Rows",
      description: "How many joined rows to return, after sorting; defaults to 50. Caps the OUTPUT only — up to 5000 rows per period are always fetched, so the totals cover everything even when the row list is short, unless `truncated` is true. `has_more` means the join produced more rows than were returned.",
      optional: true,
      default: DEFAULT_ROW_LIMIT,
    },
  },
  async run({ $ }) {
    const {
      googleSearchConsole,
      siteUrl,
      currentStartDate,
      currentEndDate,
      previousStartDate,
      previousEndDate,
      dimensions,
      searchType,
      dataState,
      filterDimension,
      filterOperator,
      filterValue,
      advancedDimensionFilters,
      sortBy,
      rowLimit,
    } = this;

    const dimensionFilterGroups = buildDimensionFilterGroups({
      app: googleSearchConsole,
      filterValue,
      filterDimension,
      filterOperator,
      advancedDimensionFilters,
    });

    const groupBy = dimensions?.length
      ? dimensions.map((dimension) => trimIfString(dimension))
      : undefined;

    // `type` is the supported request key; `searchType` is deprecated server-side.
    const baseBody = {
      dimensions: groupBy,
      type: trimIfString(searchType),
      dataState: trimIfString(dataState),
      dimensionFilterGroups,
      rowLimit: INTERNAL_ROW_LIMIT,
      startRow: 0,
    };

    for (const key of Object.keys(baseBody)) {
      if (baseBody[key] === undefined) {
        delete baseBody[key];
      }
    }

    const current = {
      startDate: trimIfString(currentStartDate),
      endDate: trimIfString(currentEndDate),
    };
    const previous = {
      startDate: trimIfString(previousStartDate),
      endDate: trimIfString(previousEndDate),
    };

    const [
      currentResponse,
      previousResponse,
    ] = await Promise.all([
      googleSearchConsole.getSitePerformanceData({
        $,
        url: siteUrl,
        data: {
          ...baseBody,
          ...current,
        },
      }),
      googleSearchConsole.getSitePerformanceData({
        $,
        url: siteUrl,
        data: {
          ...baseBody,
          ...previous,
        },
      }),
    ]);

    // A period that comes back exactly at the cap almost certainly had more rows behind
    // it, and there is no paging here — so say so rather than let totals quietly understate.
    const truncated = (currentResponse?.rows?.length ?? 0) >= INTERNAL_ROW_LIMIT
      || (previousResponse?.rows?.length ?? 0) >= INTERNAL_ROW_LIMIT;

    const comparison = buildComparison({
      currentRows: currentResponse?.rows ?? [],
      previousRows: previousResponse?.rows ?? [],
      sortBy: sortBy || "clicks_delta",
      rowLimit: rowLimit ?? DEFAULT_ROW_LIMIT,
    });

    const note = groupBy?.includes("query")
      ? "Google omits anonymized (rare) queries from query-dimension rows, so these row sums understate the property total. Compare with no dimensions, or by date, for true totals."
      : null;

    const {
      totals, rows, row_count: rowCount, has_more: hasMore,
    } = comparison;

    const truncationNote = truncated
      ? ` — truncated at ${INTERNAL_ROW_LIMIT} rows per period`
      : "";

    $.export("$summary", `Compared ${current.startDate}..${current.endDate} vs ${previous.startDate}..${previous.endDate}: clicks ${totals.previous.clicks} → ${totals.current.clicks} (${formatPctChange(totals.pct_change.clicks)}), ${rowCount} rows${truncationNote}`);

    return {
      current_period: current,
      previous_period: previous,
      totals,
      rows,
      row_count: rowCount,
      has_more: hasMore,
      truncated,
      note,
    };
  },
};
