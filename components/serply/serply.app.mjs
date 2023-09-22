import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "serply",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query. [See the documentation here.](https://moz.com/learn/seo/search-operators",
    },
    engine: {
      type: "string",
      label: "Search Engine",
      description: "The search engine to use",
      options: [
        "google",
        "bing",
        "serp",
      ],
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website to search in SERP",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.serply.io/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": `${this.$auth.api_token}`,
        },
      });
    },
    async searchGoogle(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/search",
      });
    },
    async searchBing(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/b/search",
      });
    },
    async searchSerp(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/serp",
      });
    },
  },
};
