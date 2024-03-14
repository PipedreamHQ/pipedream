import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "countdown_api",
  propDefinitions: {
    search_term: {
      type: "string",
      label: "Search Term",
      description: "The search term to use when querying eBay search results.",
    },
    ebay_domain: {
      type: "string",
      label: "eBay Domain",
      description: "The eBay domain to use for the search (e.g., ebay.com, ebay.co.uk).",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of data to retrieve (e.g., 'search', 'product', 'reviews').",
    },
    epid: {
      type: "string",
      label: "EPID",
      description: "The eBay Product Identifier.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.countdownapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "", params = {}, headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        params: {
          api_key: this.$auth.api_key,
          ...params,
        },
        headers,
        ...otherOpts,
      });
    },
    async searchProducts(opts = {}) {
      return this._makeRequest({
        path: "/search",
        params: {
          search_term: opts.search_term,
          ebay_domain: opts.ebay_domain,
          type: opts.type,
        },
      });
    },
    async getProductData(opts = {}) {
      return this._makeRequest({
        path: "/product",
        params: {
          epid: opts.epid,
          ebay_domain: opts.ebay_domain,
          type: opts.type,
        },
      });
    },
    async getProductReviews(opts = {}) {
      return this._makeRequest({
        path: "/reviews",
        params: {
          epid: opts.epid,
          ebay_domain: opts.ebay_domain,
          type: opts.type,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
