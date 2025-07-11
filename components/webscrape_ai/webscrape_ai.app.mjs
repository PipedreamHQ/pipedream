import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscrape_ai",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.webscrapeai.com";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apiKey: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: "/scrapeWebSite",
        ...opts,
      });
    },
  },
};
