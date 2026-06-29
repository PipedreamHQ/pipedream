import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";

export default {
  key: "notion-query-database",
  name: "Query Data Source",
  description:
    "Filter and sort the pages (rows) inside a Notion database (data source) by their property values."
    + " **Discover exact property names and option values with Retrieve Database Schema first**, then build a filter against them."
    + " A `filter` is a JSON object: a single condition `{ \"property\": \"Status\", \"select\": { \"equals\": \"Escaped\" } }`, or a compound `{ \"and\": [ ... ] }` / `{ \"or\": [ ... ] }`."
    + " The condition key matches the property type — e.g. `select`, `status`, `multi_select`, `number` (`{ \"greater_than\": 5 }`), `checkbox` (`{ \"equals\": true }`), `rich_text`/`title` (`{ \"contains\": \"...\" }`), `date`."
    + " Omit `filter` to return all rows."
    + " Provide the **data source ID** (use **Search** with `filter: data_source` to resolve a database name)."
    + " [See the documentation](https://developers.notion.com/reference/filter-data-source-entries)",
  version: "1.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "The ID of the database's data source. Use **Search** (`filter: data_source`) to resolve a database name into its ID.",
    },
    filter: {
      label: "Filter",
      description: "A JSON object describing the filter. **A single-condition filter MUST include both a `property` key (the column name from the database schema) and a type-specific operator key** — e.g. `{ \"property\": \"Status\", \"select\": { \"equals\": \"Escaped\" } }`. Filtering by title needs `{ \"property\": \"<title-column-name>\", \"title\": { \"contains\": \"...\" } }` — call **Retrieve Database Schema** first if you don't already know the title column's exact name. Compound filters use `{ \"and\": [ ... ] }` or `{ \"or\": [ ... ] }`. Omit this prop to return all rows. [See the documentation](https://developers.notion.com/reference/filter-data-source-entries).",
      type: "string",
      optional: true,
    },
    sorts: {
      label: "Sorts",
      description: "Sort order as a JSON array string. Example: `[ { \"property\": \"Name\", \"direction\": \"ascending\" } ]`. [See the documentation](https://developers.notion.com/reference/sort-data-source-entries).",
      type: "string",
      optional: true,
    },
    pageSize: {
      propDefinition: [
        notion,
        "pageSize",
      ],
    },
    startCursor: {
      propDefinition: [
        notion,
        "startCursor",
      ],
      description: "Pagination cursor from a previous response's `next_cursor`. Omit for the first page.",
    },
  },
  async run({ $ }) {
    const {
      filter, sorts,
    } = this;

    // Only include filter/sorts when provided — the Notion API rejects
    // `sorts: null` / `filter: null` (must be an array/object or undefined).
    const params = {
      page_size: this.pageSize || undefined,
      start_cursor: this.startCursor || undefined,
    };
    // Notion's data-source query API rejects requests without a non-empty
    // `filter` body field (returns "body.filter.or should be defined…"). To
    // honor the "omit filter to return all rows" affordance, send a no-op
    // `{ "and": [] }` when the caller hasn't supplied one.
    //
    // Don't use `parseStringToJSON(filter, undefined)` — the helper has a
    // `defaultValue = {}` default param that kicks in when the second arg
    // is `undefined`, so we'd silently get `{}` (empty filter, rejected by
    // the API) instead of `undefined`.
    const parsedFilter = typeof filter === "string" && filter.length > 0
      ? JSON.parse(filter)
      : undefined;
    params.filter = parsedFilter ?? {
      and: [],
    };
    const parsedSorts = utils.parseStringToJSON(sorts, undefined);
    if (Array.isArray(parsedSorts) && parsedSorts.length) {
      params.sorts = parsedSorts;
    }

    const dataSourceId = utils.extractNotionId(this.dataSourceId);
    const response = await this.notion.queryDataSource(dataSourceId, params);

    const length = response?.results?.length ?? 0;
    $.export("$summary", `Retrieved ${length} result${length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
