import app from "../../autom.app.mjs";

export default {
  key: "autom-google-search-light",
  name: "Google Search Light",
  description: "Search Google and return only the organic results, the fastest Google search. Use **Google Search** for the knowledge graph and related searches. [See the documentation](https://docs.autom.dev/api-reference/google/search/light)",
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
    const response = await this.app.searchGoogleLight({
      $,
      params: {
        query: this.query,
        google_domain: this.googleDomain,
        gl: this.country,
        hl: this.language,
      },
    });
    $.export("$summary", `Found ${response.organic_results?.length ?? 0} results for "${this.query}"`);
    return response;
  },
};
