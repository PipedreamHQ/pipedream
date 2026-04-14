import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-search",
  name: "Search",
  description: "Performs a web search and returns raw, ranked results. [See the documentation](https://docs.perplexity.ai/api-reference/search-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    maxTokensPerPage: {
      propDefinition: [
        app,
        "maxTokensPerPage",
      ],
    },
    maxTokensTotal: {
      propDefinition: [
        app,
        "maxTokensTotal",
      ],
    },
    searchDomainFilter: {
      propDefinition: [
        app,
        "searchDomainFilter",
      ],
    },
    searchLanguageFilter: {
      propDefinition: [
        app,
        "searchLanguageFilter",
      ],
    },
    searchRecencyFilter: {
      propDefinition: [
        app,
        "searchRecencyFilter",
      ],
    },
  },
  async run({ $ }) {
    let query = this.query;
    try {
      const parsed = JSON.parse(query);
      if (Array.isArray(parsed)) {
        query = parsed;
      }
    } catch {
      // not JSON, use as-is
    }

    const response = await this.app.search({
      $,
      data: {
        query,
        ...(this.maxResults != null && {
          max_results: this.maxResults,
        }),
        ...(this.maxTokensPerPage != null && {
          max_tokens_per_page: this.maxTokensPerPage,
        }),
        ...(this.maxTokensTotal != null && {
          max_tokens: this.maxTokensTotal,
        }),
        ...(this.searchDomainFilter && {
          search_domain_filter: this.searchDomainFilter,
        }),
        ...(this.searchLanguageFilter && {
          search_language_filter: this.searchLanguageFilter,
        }),
        ...(this.searchRecencyFilter && {
          search_recency_filter: this.searchRecencyFilter,
        }),
      },
    });

    const count = response.results?.length ?? 0;
    $.export("$summary", `Successfully returned ${count} search result(s).`);
    return response;
  },
};
