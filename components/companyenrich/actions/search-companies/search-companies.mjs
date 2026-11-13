import companyenrich from "../../companyenrich.app.mjs";
import {
  companyQuery, integerValue, stringValue, companyExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-companies",
  name: "Search Companies",
  description: "Search companies using structured filters, a semantic query, or lookalike seeds. Standard, semantic and lookalike searches cost 1, 2 and 5 credits per company respectively; an empty result costs one base result, plus expansions when returned. Fetches up to **Maximum Pages**, preserving each page and its cursor. Defaults to one page. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-search)",
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
    companyFilter: {
      propDefinition: [
        companyenrich,
        "companyFilter",
      ],
    },
    semantic: {
      propDefinition: [
        companyenrich,
        "semantic",
      ],
    },
    lookalike: {
      propDefinition: [
        companyenrich,
        "lookalike",
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
    companyExpand: {
      propDefinition: [
        companyenrich,
        "companyExpand",
      ],
    },
  },
  /**
   * Build the company query and collect bounded pages with the requested expansions.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The original page or collected pages, preserving scores and
   * continuation cursor.
   */
  async run({ $ }) {
    const response = await this.companyenrich.collectPages({
      $,
      method: "searchCompanies",
      maxPages: this.maxPages,
      data: {
        ...companyQuery(this),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 1024),
        expand: companyExpansions(this.companyExpand),
      },
    });
    const pages = response.pages ?? [
      response,
    ];
    const count = pages.reduce((total, page) => total + (page.items?.length ?? 0), 0);
    const completion = response.partial
      ? "; partial results returned at the pagination time limit"
      : "";
    $.export("$summary", `Retrieved ${count} companies across ${pages.length} page(s)${completion}`);
    return response;
  },
};
