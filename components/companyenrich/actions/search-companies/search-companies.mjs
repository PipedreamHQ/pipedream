import companyenrich from "../../companyenrich.app.mjs";
import {
  companyQuery, integerValue, stringValue, companyExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-companies",
  name: "Search Companies",
  description: "Search companies using structured filters, a semantic query, or lookalike seeds. Standard, semantic and lookalike searches cost 1, 2 and 5 credits per company respectively; an empty result costs one base result, plus expansions when returned. Returns one page, preserving order and nextCursor; no automatic pagination. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-search)",
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
  async run({ $ }) {
    const response = await this.companyenrich.searchCompanies({
      $,
      data: {
        ...companyQuery(this),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 1024),
        expand: companyExpansions(this.companyExpand),
      },
    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} companies in one page`);
    return response;
  },
};
