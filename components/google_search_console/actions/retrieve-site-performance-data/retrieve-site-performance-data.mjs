import googleSearchConsole from "../../google_search_console.app.mjs";
import { buildDimensionFilterGroups } from "../../common/filters.mjs";
import { trimIfString } from "../../common/utils.mjs";

const DEFAULT_ROW_LIMIT = 50;

export default {
  name: "Query Search Analytics",
  description: "Query Google Search Console search analytics for one property and one date range: clicks, impressions, CTR and average position, optionally grouped by dimensions and filtered. This is the main traffic-reporting tool for a site.\n\n"
    + "**When to use:** any single-date-range question about how a site performs in Google Search — top queries, top pages, country or device splits, daily or hourly trends, the CTR or average position of a term. Use **Compare Search Analytics** instead for period-over-period questions (month over month, quarter over quarter, year over year, \"did the update hurt us\") — it fetches both ranges and joins them for you. Use **Inspect URLs** for index status, canonicals and crawl state; this tool only reports traffic.\n\n"
    + "**Returns:** the API response unchanged — `rows` (each `{ keys, clicks, impressions, ctr, position }`, where `keys` lines up positionally with `dimensions`), `responseAggregationType` and `metadata` — plus four added fields: `row_count`; `has_more` (true when the page came back full, so more rows probably exist); `next_start_row` (pass it back as `startRow` for the next page); and `returned_totals` (`clicks` and `impressions` summed over the RETURNED rows only).\n\n"
    + "**Cross-references:** call **List Sites** first when the user names a site in prose rather than giving an exact property identifier — it also reports your permission level. **Compare Search Analytics** answers two-period questions. **Inspect URLs** tells you whether a page reported here is actually indexed.\n\n"
    + "**Parameter guidance:**\n"
    + "- `startDate`/`endDate` are `YYYY-MM-DD`, **Pacific Time**, and inclusive. Data is final only after about 2-3 days, and retention is 16 months — a `startDate` older than that returns a 400.\n"
    + "- `dimensions` groups the rows. `searchAppearance` cannot be combined with any other dimension (two-pass pattern: fetch the appearance types alone, then filter by one). `hour` cannot be combined with `date`, requires `dataState: hourly_all`, and spans at most 10 days — combining them returns 400 \"Request cannot be grouped by both date and hour\". Discover has no `query` dimension: 400 \"Request for DISCOVER cannot be grouped by query\" — when the user asks for Discover queries, do not stop to ask; report Discover pages instead (`searchType: discover`, `dimensions: [\"page\"]`) and say why. With no dimensions you get a single totals row. With `date` (and `hour`) the API returns a row for EVERY day in the range, including days with 0 impressions — when counting active days, count rows with `impressions > 0`, not rows.\n"
    + "- `aggregationType: byProperty` is rejected whenever a `page` dimension or a page filter is present: 400 \"'BY_PROPERTY' is not a valid aggregation type in the context of the request.\" Average position under `byPage` is not the same number as under `byProperty` — the property-level average position is the `byProperty` one.\n"
    + "- `rowLimit` defaults to 50 and maxes at 25000, but keep it at 200 or below per call: 100 rows is about 13k characters of output and 400 rows already exceeds the output cap and gets spilled to a file you cannot read. For long `date` sweeps use `rowLimit: 200` and page with `startRow`. Page with `startRow` while `has_more` is true; there is no page token. The last page is the one where `rows.length < rowLimit`, and an empty final page is normal.\n"
    + "- Filtering: set `subdomainFilter` (the filter VALUE, despite the legacy name) with `filterDimension`/`filterOperator` for the common single-condition case, or `advancedDimensionFilters` for multi-condition filtering. `subdomainFilter` wins — `advancedDimensionFilters` is ignored when it is set.\n\n"
    + "**Common mistakes:**\n"
    + "- Constructing the property identifier instead of copying it from **List Sites**. `sc-domain:example.com` and `https://www.example.com/` are different properties, and the wrong string returns 403.\n"
    + "- Treating `returned_totals` as the property total. It is not, especially when grouping by `query`: Google omits anonymized (rare) queries, so the sum of query rows is materially LESS than the same range grouped by `date`. For a true total, query with no dimensions or with `date`.\n"
    + "- Re-averaging `ctr` or `position` across rows. Both are impression-weighted; a plain mean is wrong. `ctr` is a 0-1 fraction (0.1428 means 14.3%) and `position` is a 1-indexed float where lower is better.\n"
    + "- Answering from a truncated first page. Check `has_more` before reporting a count or a \"top N\".\n\n"
    + "**Example:** `siteUrl=\"sc-domain:example.com\"`, `startDate=\"2025-09-01\"`, `endDate=\"2026-08-31\"`, `dimensions=[\"query\"]`, `rowLimit=10` returns rows such as `{ keys: [\"example brand\"], clicks: 41, impressions: 287, ctr: 0.1429, position: 2.4 }` plus `row_count: 10`, `has_more: true`, `next_start_row: 10` and `returned_totals: { clicks: 41, impressions: 294 }`.\n\n"
    + "There is no `fields` parameter — rows are already minimal, so `rowLimit` plus `has_more`/`next_start_row` is the payload lever. Quota: 1,200 queries per minute per site. [See the documentation](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)",
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
      description: "First day of the range, inclusive, in `YYYY-MM-DD` **Pacific Time** — e.g. `2025-09-01`. Search Console keeps 16 months of data; a start date outside that window returns a 400. Data for the most recent 2-3 days is not final yet, so it is omitted unless `dataState` is `all`.",
    },
    endDate: {
      type: "string",
      label: "End Date (YYYY-MM-DD)",
      description: "Last day of the range, inclusive, in `YYYY-MM-DD` **Pacific Time** — e.g. `2026-08-31`. Because reporting lags by about 2-3 days, an end date of today usually returns nothing for the final days unless `dataState` is `all`.",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      optional: true,
      description: "How to group the rows. Each row's `keys` array lines up positionally with this list, so `[\"query\",\"device\"]` yields `keys: [\"example brand\",\"MOBILE\"]`. Leave empty for a single totals row. Rules: `searchAppearance` cannot be combined with ANY other dimension (fetch the appearance types alone, then filter by one with `filterDimension: searchAppearance`); `hour` cannot be combined with `date`, requires `dataState: hourly_all`, and covers at most 10 days — otherwise the API returns 400 \"Request cannot be grouped by both date and hour\"; Discover (`searchType: discover`) has no `query` dimension and returns 400 \"Request for DISCOVER cannot be grouped by query\". `date` returns one row per calendar day in the range, zero-impression days included.",
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
      description: "How Google aggregates the metrics. `auto` (the default behaviour) lets Google choose — by page when grouping by page, by property otherwise. `byPage` aggregates by URI; `byProperty` aggregates across the whole property; `byNewsShowcasePanel` is for News Showcase reporting. `byProperty` is rejected whenever a `page` dimension or a page filter is present: the API returns 400 \"'BY_PROPERTY' is not a valid aggregation type in the context of the request.\" Average position differs between the two: the property-level average position is the `byProperty` number, and it does not equal the average of the `byPage` rows.",
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
      description: "Rows to return in this call. Defaults to 50; the API maximum is 25000. Size it to the task — 5-10 for a \"top query\" answer, more for a sweep — and keep it at 200 or below per call (100 rows ≈ 13k characters; 400 rows exceeds the output cap and is spilled to a file you cannot read). When `has_more` comes back true, request the next page with `startRow: next_start_row`; there is no page token. Stop when a page returns fewer rows than `rowLimit` (an empty final page is normal).",
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
      description: "The value to filter on, for ANY dimension — not just subdomains (the prop key is legacy). It is combined with `filterDimension` and `filterOperator` into a single filter: for example `filterDimension: page`, `filterOperator: contains`, value `https://www.example.com/blog/`. `page` expressions match the FULL URL (scheme and host included), not just a path. String comparison is case-insensitive; regex operators use RE2. When this is set, `advancedDimensionFilters` is ignored.",
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
      description: "Which data to include. `final` (default) returns only finalized data, which lags roughly 2-3 days behind today. `all` also includes the most recent, not-yet-final days and adds `metadata.firstIncompleteDate` to the response — use it when the user explicitly wants recent or partial numbers. `hourly_all` is required by the `hour` dimension.",
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
        const sites = await googleSearchConsole.getSites({
          $,
        });
        const list = (sites?.siteEntry ?? [])
          .map((site) => `${site.siteUrl} (${site.permissionLevel})`)
          .join(", ");
        throw new Error(`Access denied for "${siteUrl}". Properties this account can access: ${list}. Use the exact string from List Sites (domain properties look like sc-domain:example.com; URL-prefix properties need the trailing slash).`);
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
