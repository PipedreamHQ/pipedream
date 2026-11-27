import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contextfetch",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "What to search the web for (up to 2,000 characters), e.g. `python asyncio timeout`",
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Public http(s) page URLs to fetch (up to 10), e.g. `https://docs.python.org/3/library/asyncio.html`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.contextfetch.dev/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search",
        ...opts,
      });
    },
    getContents(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contents",
        ...opts,
      });
    },
  },
};
