import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "piloterr",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://piloterr.com/api/v2";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getWebsiteTechnology(opts = {}) {
      return this._makeRequest({
        path: "/website/technology",
        ...opts,
      });
    },
    getCompanyData(opts = {}) {
      return this._makeRequest({
        path: "/company",
        ...opts,
      });
    },
    scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: "/website/crawler",
        ...opts,
      });
    },
  },
};
