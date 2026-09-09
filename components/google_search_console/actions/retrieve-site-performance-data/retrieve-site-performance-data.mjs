import googleSearchConsole from "../../google_search_console.app.mjs";
import { buildDimensionFilterGroups } from "../../common/filters.mjs";
import { trimIfString } from "../../common/utils.mjs";

const DEFAULT_ROW_LIMIT = 50;

export default {
  name: "Query Search Analytics",
  description: "Query Google Search Console search analytics for one property and one date range: "
    + "clicks, impressions, CTR and average position, optionally grouped by dimensions and filtered. "
    + "This is the main traffic-reporting tool for a site."
    + "\n\n**Use for** any single-date-range question about how a site performs in Google Search — top "
    + "queries, top pages, country or device splits, daily or hourly trends, the CTR or average "
    + "position of a term. Use **Compare Search Analytics** instead for period-over-period questions "
    + "(month over month, year over year, \"did the update hurt us\") — it fetches both ranges and "
    + "joins them for you. Use **Inspect URLs** for index status, canonicals and crawl state; this tool "
    + "only reports traffic."
    + "\n\n**Returns** the API response unchanged — `rows` (each `{ keys, clicks, impressions, ctr, "
    + "position }`, where `keys` lines up positionally with `dimensions`), `responseAggregationType` "
    + "and `metadata` — plus `row_count`, `has_more` (the page came back full, so more rows probably "
    + "exist), `next_start_row` (pass it back as `startRow`) and `returned_totals` (`clicks` and "
    + "`impressions` summed over the RETURNED rows only)."
    + "\n\n**Reading the numbers.** `ctr` is a 0-1 fraction (`0.1428` means 14.3%) and `position` is a "
    + "1-indexed float where LOWER is better. Both are impression-weighted, so never re-average them "
    + "across rows — a plain mean is wrong. `returned_totals` is not the property total, least of all "
    + "when grouping by `query`: Google omits anonymized (rare) queries, so the sum of query rows is "
    + "materially LESS than the same range grouped by `date`. For a true total, query with no "
    + "dimensions or with `date`. And check `has_more` before reporting a count or a \"top N\" — a "
    + "truncated first page is not the whole answer."
    + "\n\n**Discover has no `query` dimension** (400 \"Request for DISCOVER cannot be grouped by "
    + "query\"). When the user asks for Discover queries, do not stop to ask: report Discover pages "
    + "instead (`searchType: discover`, `dimensions: [\"page\"]`) and say why."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, `startDate=\"2025-09-01\"`, "
    + "`endDate=\"2026-08-31\"`, `dimensions=[\"query\"]`, `rowLimit=10` returns rows such as "
    + "`{ keys: [\"example brand\"], clicks: 41, impressions: 287, ctr: 0.1429, position: 2.4 }` plus "
    + "`row_count: 10`, `has_more: true` and `next_start_row: 10`."
    + "\n\nThere is no `fields` parameter — rows are already minimal, so `rowLimit` plus "
    + "`has_more`/`next_start_row` is the payload lever. Quota: 1,200 queries per minute per site. "
    + "[See the documentation](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)",
  key: "google_search_console-retrieve-site-performance-data",
  version: "1.1.0",
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
    startDate: {
      type: "string",
      label: "Start Date (YYYY-MM-DD)",
      description: "First day of the range, inclusive, `YYYY-MM-DD` **Pacific Time** — e.g. `2025-09-01`. Search Console keeps 16 months; an earlier date returns a 400.",
    },
    endDate: {
      type: "string",
      label: "End Date (YYYY-MM-DD)",
      description: "Last day of the range, inclusive, `YYYY-MM-DD` **Pacific Time** — e.g. `2026-08-31`. Reporting lags 2-3 days, so an end date of today returns nothing for the final days unless `dataState` is `all`.",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      optional: true,
      description: "How to group the rows; each row's `keys` lines up positionally with this list, so `[\"query\",\"device\"]` yields `keys: [\"example brand\",\"MOBILE\"]`. Leave empty for a single totals row. Combination rules, each a 400 if broken: `searchAppearance` cannot be combined with ANY other dimension (fetch the appearance types alone, then filter by one with `filterDimension: searchAppearance`); `hour` cannot be combined with `date`, requires `dataState: hourly_all`, and covers at most 10 days; Discover (`searchType: discover`) has no `query` dimension. `date` returns one row per calendar day, zero-impression days included — so count rows with `impressions > 0`, not rows, for active days.",
      options: [
        "query",
        "page",
        "country",
        "device",
        "searchAppearance",
        "date",
        "hour",
      ],
    },
    searchType: {
      propDefinition: [
        googleSearchConsole,
        "searchType",
      ],
    },
    aggregationType: {
      type: "string",
      label: "Aggregation Type",
      description: "How Google aggregates the metrics. `auto` (default) lets Google choose — by page when grouping by page, by property otherwise. `byPage` aggregates by URI, `byProperty` across the whole property, `byNewsShowcasePanel` is for News Showcase. `byProperty` is rejected whenever a `page` dimension or page filter is present: 400 \"'BY_PROPERTY' is not a valid aggregation type in the context of the request.\" The property-level average position is the `byProperty` number and does NOT equal the average of the `byPage` rows.",
      optional: true,
      options: [
        "auto",
        "byPage",
        "byProperty",
        "byNewsShowcasePanel",
      ],
    },
    rowLimit: {
      type: "integer",
      label: "Max Rows",
      description: "Rows to return in this call. Defaults to 50; API maximum 25000, but keep it at 200 or below — 100 rows is ≈13k characters and 400 rows exceeds the output cap and is spilled to a file you cannot read. Size it to the task: 5-10 for a \"top query\" answer, 200 for a sweep, then page with `startRow: next_start_row` while `has_more` is true (there is no page token). The last page is the one returning fewer rows than `rowLimit`; an empty final page is normal.",
      default: DEFAULT_ROW_LIMIT,
      optional: true,
    },
    startRow: {
      type: "integer",
      label: "Start Row",
      description: "Zero-based index of the first row to return. Omit for the first page, then pass the `next_start_row` value from the previous response to page forward.",
      optional: true,
    },
    subdomainFilter: {
      type: "string",
      label: "Filter Value",
      optional: true,
      description: "The value to filter on, for ANY dimension — not just subdomains (the prop key is legacy). Combined with `filterDimension` and `filterOperator` into one filter, e.g. `filterDimension: page`, `filterOperator: contains`, value `https://www.example.com/blog/`. `page` expressions match the FULL URL, scheme and host included, not a path. When this is set, `advancedDimensionFilters` is ignored.",
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
    advancedDimensionFilters: {
      propDefinition: [
        googleSearchConsole,
        "advancedDimensionFilters",
      ],
    },
    dataState: {
      type: "string",
      label: "Data State",
      description: "Which data to include. `final` (default) returns only finalized data, which lags roughly 2-3 days. `all` also includes the most recent, not-yet-final days and adds `metadata.firstIncompleteDate` — use it when the user explicitly wants recent or partial numbers. `hourly_all` is required by the `hour` dimension.",
      optional: true,
      options: [
        "final",
        "all",
        "hourly_all",
      ],
      default: "final",
    },
  },
  async run({ $ }) {
    const {
      googleSearchConsole,
      siteUrl,
      startDate,
      endDate,
      dimensions,
      searchType,
      aggregationType,
      rowLimit,
      startRow,
      subdomainFilter,
      filterDimension,
      filterOperator,
      advancedDimensionFilters,
      dataState,
    } = this;

    const dimensionFilterGroups = buildDimensionFilterGroups({
      app: googleSearchConsole,
      filterValue: subdomainFilter,
      filterDimension,
      filterOperator,
      advancedDimensionFilters,
    });

    // The API's deprecated key is `searchType`; the supported one is `type`. The body is
    // assembled explicitly so no prop name leaks into the request by accident.
    const effectiveRowLimit = rowLimit ?? DEFAULT_ROW_LIMIT;
    const effectiveStartRow = startRow ?? 0;

    const data = {
      startDate: trimIfString(startDate),
      endDate: trimIfString(endDate),
      dimensions: dimensions?.length
        ? dimensions.map((dimension) => trimIfString(dimension))
        : undefined,
      type: trimIfString(searchType),
      aggregationType: trimIfString(aggregationType),
      rowLimit: effectiveRowLimit,
      startRow: effectiveStartRow,
      dataState: trimIfString(dataState),
      dimensionFilterGroups,
    };

    for (const key of Object.keys(data)) {
      if (data[key] === undefined) {
        delete data[key];
      }
    }

    let response;
    try {
      response = await googleSearchConsole.getSitePerformanceData({
        $,
        url: siteUrl,
        data,
      });
    } catch (error) {
      // The only permitted error rewrite. Google returns the same 403 for four unrelated
      // causes, so name the properties this account really has.
      if (error.response?.status === 403) {
        // If the token or scope is what failed, listing the sites fails too — surface the
        // original Search Console error rather than the lookup's rejection.
        let list;
        try {
          const sites = await googleSearchConsole.getSites({
            $,
          });
          list = (sites?.siteEntry ?? [])
            .map((site) => `${site.siteUrl} (${site.permissionLevel})`)
            .join(", ");
        } catch {
          throw error;
        }
        throw new Error(`Access denied for "${trimIfString(siteUrl)}". Properties this account can access: ${list}. Use the exact string from List Sites (domain properties look like sc-domain:example.com; URL-prefix properties need the trailing slash).`);
      }
      throw error;
    }

    const rows = response?.rows ?? [];
    const returnedTotals = rows.reduce((acc, row) => ({
      clicks: acc.clicks + (row.clicks || 0),
      impressions: acc.impressions + (row.impressions || 0),
    }), {
      clicks: 0,
      impressions: 0,
    });

    const hasMore = rows.length === effectiveRowLimit;
    const nextStartRow = effectiveStartRow + rows.length;

    $.export("$summary", hasMore
      ? `Fetched ${rows.length} rows (more available — next startRow ${nextStartRow})`
      : `Fetched ${rows.length} ${rows.length === 1
        ? "row"
        : "rows"}`);

    return {
      ...response,
      row_count: rows.length,
      has_more: hasMore,
      next_start_row: nextStartRow,
      returned_totals: returnedTotals,
    };
  },
};
