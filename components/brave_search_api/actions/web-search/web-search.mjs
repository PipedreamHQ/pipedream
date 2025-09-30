import app from "../../brave_search_api.app.mjs";

export default {
  key: "brave_search_api-web-search",
  name: "Web Search",
  description: "Query Brave Search and get back search results from the web. [See the documentation](https://api-dashboard.search.brave.com/app/documentation/web-search/get-started)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    searchLang: {
      propDefinition: [
        app,
        "searchLang",
      ],
    },
    uiLang: {
      propDefinition: [
        app,
        "uiLang",
      ],
    },
    safesearch: {
      propDefinition: [
        app,
        "safesearch",
      ],
    },
  },
  async run({ $ }) {
    const allResults = [];
    const count = 20;
    for (let offset = 0; offset < 5; offset++) {
      const response = await this.app.webSearch({
        $,
        params: {
          q: this.q,
          country: this.country,
          search_lang: this.searchLang,
          ui_lang: this.uiLang,
          safesearch: this.safesearch,
          count,
          offset,
        },
      });

      const results = response.web?.results;
      allResults.push(...results);

      if (results.length < count) {
        break;
      }
    }

    $.export("$summary", `Retrieved ${allResults.length} results`);
    return {
      allResults,
    };
  },
};
