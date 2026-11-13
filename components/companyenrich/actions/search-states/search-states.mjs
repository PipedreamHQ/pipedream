import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, integerValue, stringArray, countryCode,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-states",
  name: "Search States",
  description: "Search states by a case-insensitive name substring. Fetches up to **Maximum Pages** without consuming credits; defaults to one page. Use returned codes or IDs in search filters. [See the documentation](https://docs.companyenrich.com/reference/post_v2-geo-states)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    query: {
      propDefinition: [
        companyenrich,
        "query",
      ],
    },
    countryCodes: {
      propDefinition: [
        companyenrich,
        "countryCodes",
      ],
    },
    pageSize: {
      propDefinition: [
        companyenrich,
        "pageSize",
      ],
    },
    maxPages: {
      propDefinition: [
        companyenrich,
        "maxPages",
      ],
      description: "Maximum geographic pages to fetch, e.g. `3`. Accepts 1 to 100; defaults to 1. These lookups consume no CompanyEnrich credits. With 1, returns the original page; with more than 1, returns `{ pages, nextCursor }`. Stops early when no next cursor remains or the 20-second pagination time budget is reached.",
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
      description: "Opaque nextCursor from **Search States**, e.g. `eyJ...`. Keep the same filters; expires after 30 minutes. Omit for the first page.",
    },
  },
  /**
   * Validate country filters and collect a bounded sequence of matching state pages.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The original page or collected pages with their continuation cursor.
   */
  async run({ $ }) {
    const response = await this.companyenrich.collectPages({
      $,
      method: "searchStates",
      maxPages: this.maxPages,
      data: {
        query: stringValue(this.query, "Query", 100),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 2048),
        countryCodes: stringArray(this.countryCodes, "Country Codes", 0, 250)?.map(countryCode),
      },
    });
    const pages = response.pages ?? [
      response,
    ];
    const count = pages.reduce((total, page) => total + (page.items?.length ?? 0), 0);
    const completion = response.partial
      ? "; partial results returned at the pagination time limit"
      : "";
    $.export("$summary", `Retrieved ${count} states across ${pages.length} page(s)${completion}`);
    return response;
  },
};
