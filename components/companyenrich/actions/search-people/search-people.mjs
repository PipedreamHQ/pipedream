import companyenrich from "../../companyenrich.app.mjs";
import {
  peopleQuery, integerValue, stringValue, personExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-people",
  name: "Search People",
  description: "Find professional profiles with person and employer filters. Ordinary search does not return emails; use **Find Work Email (Beta)** when needed. Costs 2 credits per person and a 2-credit minimum for empty results, plus paid education expansion. Fetches up to **Maximum Pages**, preserving each page and its cursor. Defaults to one page. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-search)",
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
    $.export("$summary", `Retrieved ${count} people across ${pages.length} page(s)`);
    return response;
  },
};
