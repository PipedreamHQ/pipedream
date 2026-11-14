import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "piloterr",
  propDefinitions: {
    page: {
      type: "integer",
      label: "Page",
      description: "Page of results to return, starting at 1, e.g. `2`. Defaults to `1`.",
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.piloterr.com/v2";
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
    renderWebsite(opts = {}) {
      return this._makeRequest({
        path: "/website/rendering",
        ...opts,
      });
    },
    searchGoogle(opts = {}) {
      return this._makeRequest({
        path: "/google/search",
        ...opts,
      });
    },
    searchAmazon(opts = {}) {
      return this._makeRequest({
        path: "/amazon/search",
        ...opts,
      });
    },
    searchEbay(opts = {}) {
      return this._makeRequest({
        path: "/ebay/search",
        ...opts,
      });
    },
    getEbayListing(opts = {}) {
      return this._makeRequest({
        path: "/ebay/product",
        ...opts,
      });
    },
    getLinkedinCompany(opts = {}) {
      return this._makeRequest({
        path: "/linkedin/company/info",
        ...opts,
      });
    },
    getCrunchbaseCompany(opts = {}) {
      return this._makeRequest({
        path: "/crunchbase/company/info",
        ...opts,
      });
    },
    getZillowProperty(opts = {}) {
      return this._makeRequest({
        path: "/zillow/property",
        ...opts,
      });
    },
  },
};
