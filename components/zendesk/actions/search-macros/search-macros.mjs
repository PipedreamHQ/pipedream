import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-search-macros",
  name: "Search Macros",
  description: "Search for macros by name. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/business-rules/macros/#search-macros).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for macros",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of macros to retrieve per page. Default: 100",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const macros = await this.zendesk.searchMacros({
      $,
      params: {
        query: this.query,
        page: this.page,
        per_page: this.perPage,
      },
    });

    $.export("$summary", "Successfully searched for macros");
    return macros;
  },
};
