import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "keenable",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query. Example: `JavaScript testing frameworks`",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the page to fetch, e.g. `https://example.com/article`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.keenable.ai/v1";
    },
    _headers() {
      return {
        "X-API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    searchWeb(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search",
        ...opts,
      });
    },
    fetchPage(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/fetch",
        ...opts,
      });
    },
  },
};
