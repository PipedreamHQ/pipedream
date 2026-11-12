import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autom",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The query to search for, e.g. `best electric cars`.",
    },
    page: {
      type: "integer",
      label: "Page Number",
      description: "Page of results to return, starting at 1, e.g. `2`. Defaults to `1`.",
      default: 1,
      min: 1,
    },
    googleDomain: {
      type: "string",
      label: "Google Domain",
      description: "The Google domain to search on, e.g. `google.fr`. Defaults to `google.com`. See the [Google domains page](https://docs.autom.dev/api-reference/google/google-domains) for the full list.",
      default: "google.com",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code to search from, e.g. `us`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Two-letter language code of the results, e.g. `en`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.autom.dev/v1";
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
        path: "/google/search",
        ...args,
      });
    },
    async searchGoogleLight(args = {}) {
      return this._makeRequest({
        path: "/google/search/light",
        ...args,
      });
    },
    async searchGoogleNews(args = {}) {
      return this._makeRequest({
        path: "/google/news",
        ...args,
      });
    },
    async searchGoogleMaps(args = {}) {
      return this._makeRequest({
        path: "/google/maps",
        ...args,
      });
    },
    async getGoogleAutocomplete(args = {}) {
      return this._makeRequest({
        path: "/google/search/autocomplete",
        ...args,
      });
    },
    async searchBing(args = {}) {
      return this._makeRequest({
        path: "/bing/search",
        ...args,
      });
    },
    async searchBrave(args = {}) {
      return this._makeRequest({
        path: "/brave/search",
        ...args,
      });
    },
    async searchDuckDuckGo(args = {}) {
      return this._makeRequest({
        path: "/duckduckgo/search",
        ...args,
      });
    },
    async searchYahoo(args = {}) {
      return this._makeRequest({
        path: "/yahoo/search",
        ...args,
      });
    },
    async findGoogleLocations(args = {}) {
      return this._makeRequest({
        path: "/finder/google-locations",
        ...args,
      });
    },
  },
};
