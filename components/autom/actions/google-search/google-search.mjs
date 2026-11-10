import app from "../../autom.app.mjs";

export default {
  key: "autom-google-search",
  name: "Google Search",
  description: "Search Google and return the full results page: organic results with their position, title, link and snippet, the knowledge graph, related searches and pagination. Use **Google Search Light** when only the organic results are needed. [See the documentation](https://docs.autom.dev/api-reference/google/search)",
  version: "0.0.3",
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
    googleDomain: {
      propDefinition: [
        app,
        "googleDomain",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchGoogle({
      $,
      params: {
        query: this.query,
        page: this.page,
        google_domain: this.googleDomain,
        gl: this.country,
        hl: this.language,
      },
    });
    $.export("$summary", `Found ${response.organic_results?.length ?? 0} results for "${this.query}"`);
    return response;
  },
};
