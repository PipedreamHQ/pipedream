import app from "../../autom.app.mjs";

export default {
  key: "autom-google-search",
  name: "Google Search",
  description: "Scrape the results from the Google search engine using the Autom.dev API. [See the documentation](https://docs.autom.dev/api-reference/google/search)",
  version: "0.0.3",
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
    googleDomain: {
      propDefinition: [
        app,
        "googleDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchGoogle({
      $,
      data: {
        query: this.query,
        page: this.page,
        google_domain: this.googleDomain,
      },
    });

    $.export("$summary", `Successfully retrieved Google search results for query "${this.query}"`);
    return response;
  },
};
