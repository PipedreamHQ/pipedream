import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "serply",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description:
        "The search query. [See the documentation here.](https://moz.com/learn/seo/search-operators)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.serply.io/v1";
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
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
    async searchGoogle({
      query, ...opts
    } = {}) {
      return this._makeRequest({
        ...opts,
        path: `/search/q=${query}`,
      });
    },
    async searchBing({
      query, ...opts
    } = {}) {
      return this._makeRequest({
        ...opts,
        path: `/b/search/q=${query}`,
      });
    },
    async searchSerp({
      query, website, domain, ...opts
    } = {}) {
      let path = `/serp/q=${query}&num=100`;
      if (website) path += `&website=${website}`;
      if (domain) path += `&domain=${domain}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
  },
};
