import companyenrich from "../../companyenrich.app.mjs";
import {
  peopleQuery, integerValue, stringValue, personExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-people",
  name: "Search People",
  description: "Find professional profiles with person and employer filters. Company queries using `query`, keyword, technology, funding, workforce, `reportedEmployees`, or required-feature filters, or semantic or lookalike queries, match people at only the 1,000 best-matching companies. Ordinary search does not return emails; use **Find Work Email (Beta)** when needed. Costs 2 credits per person and a 2-credit minimum for empty results, plus paid education expansion. Fetches up to **Maximum Pages**, preserving each page and its cursor. Defaults to one page. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-search)",
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
    personFilter: {
      propDefinition: [
        companyenrich,
        "personFilter",
      ],
    },
    companyQuery: {
      propDefinition: [
        companyenrich,
        "companyQuery",
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
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
    },
    personExpand: {
      propDefinition: [
        companyenrich,
        "personExpand",
      ],
    },
  },
  /**
   * Build person and employer criteria and collect bounded profile pages.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The original page or collected pages with their continuation cursor.
   */
  async run({ $ }) {
    const response = await this.companyenrich.collectPages({
      $,
      method: "searchPeople",
      maxPages: this.maxPages,
      data: {
        ...peopleQuery(this),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 1024),
        expand: personExpansions(this.personExpand),
      },
    });
    const pages = response.pages ?? [
      response,
    ];
    const count = pages.reduce((total, page) => total + (page.items?.length ?? 0), 0);
    const completion = response.partial
      ? "; partial results returned at the pagination time limit"
      : "";
    $.export("$summary", `Retrieved ${count} people across ${pages.length} page(s)${completion}`);
    return response;
  },
};
