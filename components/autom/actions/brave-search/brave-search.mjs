import app from "../../autom.app.mjs";

export default {
  key: "autom-brave-search",
  name: "Brave Search",
  description: "Scrape the results from Brave search engine using Autom.dev. [See the documentation](https://docs.autom.dev/api-reference/brave/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchBrave({
      $,
      data: {
        query: this.query,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved Brave search results for query "${this.query}"`);
    return response;
  },
};
