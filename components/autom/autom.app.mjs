import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autom",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The query you want to search.",
    },
    page: {
      type: "integer",
      label: "Page Number",
      description: "Defines the result offset for pagination.",
      default: 1,
      min: 1,
    },
    googleDomain: {
      type: "string",
      label: "Google Domain",
      description: "The Google domain to use for the search. See the [Google domains page](https://docs.autom.dev/api-reference/google/google-domains) for a full list of supported Google domains.",
      default: "google.com",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://autom.dev/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async searchGoogle(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/google/search",
        ...args,
      });
    },
    async searchBing(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/bing/search",
        ...args,
      });
    },
    async searchBrave(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/brave/search",
        ...args,
      });
    },
  },
};
