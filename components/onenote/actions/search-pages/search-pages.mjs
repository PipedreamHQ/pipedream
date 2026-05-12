import { ConfigurationError } from "@pipedream/platform";
import { EXPAND_PAGE_OPTIONS } from "../../common/constants.mjs";
import app from "../../onenote.app.mjs";

// OData $filter requires at least one comparison operator or filter function.
// Free-text like "dinner" or "title:dinner" has neither and will 400 at Graph.
const ODATA_OPERATORS = [
  " eq ",
  " ne ",
  " gt ",
  " ge ",
  " lt ",
  " le ",
  " and ",
  " or ",
  " not ",
  " has ",
];

const ODATA_FUNCTIONS = [
  "startswith(",
  "endswith(",
  "contains(",
  "tolower(",
  "toupper(",
  "length(",
  "indexof(",
  "substring(",
];

function looksLikeOData(filter) {
  const lower = ` ${filter.toLowerCase()} `;
  if (ODATA_OPERATORS.some((op) => lower.includes(op))) return true;
  if (ODATA_FUNCTIONS.some((fn) => lower.includes(fn))) return true;
  return false;
}

// Escape single quotes for safe embedding in OData string literals.
function escapeOData(str) {
  return str.replace(/'/g, "''");
}

export default {
  key: "onenote-search-pages",
  name: "Search Pages",
  description: "Search and list OneNote pages. Supports free-text title search, OData filtering, expansion of related resources, and pagination."
    + " Use `search` for natural-language queries against page titles (e.g., `weekly notes`, `feeding schedule`). Translated server-side to a case-insensitive `contains` filter on the page title."
    + " Use `filter` for structured OData queries (e.g., `createdDateTime gt 2026-01-01T00:00:00Z`). `search` and `filter` can be combined and are joined with `and`."
    + " Limitation: Microsoft Graph does not support searching OneNote page **body content** via this endpoint. To match on content, retrieve a candidate set by title and then call **Get Page Content** for each."
    + " Use **Get Page Content** to retrieve the body of a specific page after locating it here. Use **Get Page** for page metadata only."
    + " Returns the array of matching pages and a `nextLink` URL for pagination when more results are available."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-pages?view=graph-rest-1.0&tabs=http)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Free-text search against page titles. Case-insensitive substring match. Example: `weekly notes`, `feeding schedule`. Translated server-side to `contains(tolower(title), '<value>')`.",
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "OData filter expression for structured queries. Example: `createdDateTime gt 2026-01-01T00:00:00Z`, `title eq 'Weekly Notes'`. Combined with `search` via `and` when both are set. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      options: EXPAND_PAGE_OPTIONS,
    },
    top: {
      type: "integer",
      label: "Top",
      description: "Number of pages to return (max 100). Defaults to the Graph API's standard page size when omitted.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.filter && !looksLikeOData(this.filter)) {
      throw new ConfigurationError(
        `The Filter field expects OData $filter syntax, but received "${this.filter}".`
        + " For natural-language queries, use the **Search** field instead"
        + ` (e.g., set Search to "${this.filter}" and leave Filter empty).`
        + " For OData filtering, use syntax like: `title eq 'My Page'`,"
        + " `startswith(title, 'Daily')`, or `createdDateTime gt 2026-01-01T00:00:00Z`."
        + " [See OData filter docs](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter).",
      );
    }

    // Translate `search` to a title contains filter, then combine with user filter.
    const filterParts = [];
    if (this.search) {
      filterParts.push(`contains(tolower(title), '${escapeOData(this.search.toLowerCase())}')`);
    }
    if (this.filter) {
      filterParts.push(`(${this.filter})`);
    }
    const combinedFilter = filterParts.length
      ? filterParts.join(" and ")
      : undefined;

    const response = await this.app.getPages({
      $,
      params: {
        "$filter": combinedFilter,
        "$expand": this.expand,
        "$top": this.top,
      },
    });

    const pages = response.value ?? [];

    $.export("$summary", `Found ${pages.length} page${pages.length === 1
      ? ""
      : "s"}`);

    return {
      pages,
      nextLink: response["@odata.nextLink"] ?? null,
    };
  },
};
