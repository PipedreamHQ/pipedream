import app from "../../autom.app.mjs";

export default {
  key: "autom-google-news",
  name: "Google News",
  description: "Search Google News and return articles with their title, source, date, link and snippet. [See the documentation](https://docs.autom.dev/api-reference/google/news)",
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
    const response = await this.app.searchGoogleNews({
      $,
      params: {
        query: this.query,
        page: this.page,
        gl: this.country,
        hl: this.language,
      },
    });
    $.export("$summary", `Found ${response.organic_results?.length ?? 0} news articles for "${this.query}"`);
    return response;
  },
};
