import newsapi from "../../news_api.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "news_api-search-everything",
  name: "Search Everything",
  description: "Search through millions of articles from over 150,000 large and small news sources and blogs. [See the documentation](https://newsapi.org/docs/endpoints/everything)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    newsapi,
    q: {
      propDefinition: [
        newsapi,
        "q",
      ],
    },
    searchin: {
      propDefinition: [
        newsapi,
        "searchin",
      ],
    },
    sourceIds: {
      propDefinition: [
        newsapi,
        "sourceIds",
      ],
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "An array of domains to restrict the search to",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "An array of domains to remove from the results",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "A date and optional time for the oldest article allowed. This should be in ISO 8601 format (e.g. `2024-11-01` or `2024-11-01T17:27:47`)",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "A date and optional time for the newest article allowed. This should be in ISO 8601 format (e.g. `2024-11-01` or `2024-11-01T17:27:47`)",
      optional: true,
    },
    language: {
      propDefinition: [
        newsapi,
        "language",
      ],
    },
    sortBy: {
      propDefinition: [
        newsapi,
        "sortBy",
      ],
    },
    maxResults: {
      propDefinition: [
        newsapi,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      status, articles,
    } = await this.newsapi.searchEverything({
      $,
      params: {
        q: this.q,
        searchin: utils.joinArray(this.searchin),
        sources: utils.joinArray(this.sourceIds),
        domains: utils.joinArray(this.domains),
        excludeDomains: utils.joinArray(this.excludeDomains),
        from: this.from,
        to: this.to,
        language: this.language,
        sortBy: this.sortBy,
        pageSize: this.maxResults,
      },
    });

    if (status === "ok") {
      $.export("$summary", `Successfully retrieved ${articles.length} article${articles.length === 1
        ? ""
        : "s"}`);
    }

    return articles;
  },
};
