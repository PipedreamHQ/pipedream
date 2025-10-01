import app from "../../autom.app.mjs";

export default {
  key: "autom-bing-search",
  name: "Bing Search",
  description: "Scrape the results from Bing search engine via the Autom.dev service. [See the documentation](https://docs.autom.dev/api-reference/bing/search)",
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
    const response = await this.app.searchBing({
      $,
      data: {
        query: this.query,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved Bing search results for query "${this.query}"`);
    return response;
  },
};
