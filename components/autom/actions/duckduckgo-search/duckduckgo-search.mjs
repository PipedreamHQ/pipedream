import app from "../../autom.app.mjs";

export default {
  key: "autom-duckduckgo-search",
  name: "DuckDuckGo Search",
  description: "Search DuckDuckGo and return organic results with their position, title, link and snippet. [See the documentation](https://docs.autom.dev/api-reference/duckduckgo/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
    const response = await this.app.searchDuckDuckGo({
      $,
      params: {
        query: this.query,
        page: this.page,
      },
    });
    $.export("$summary", `Found ${response.organic_results?.length ?? 0} results for "${this.query}"`);
    return response;
  },
};
