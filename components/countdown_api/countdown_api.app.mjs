import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "countdown_api",
  propDefinitions: {
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The search term to use when querying eBay search results",
    },
    ebayDomain: {
      type: "string",
      label: "eBay Domain",
      description: "The eBay domain to use for the search (e.g., ebay.com, ebay.co.uk).",
    },
    epid: {
      type: "string",
      label: "EPID",
      description: "The eBay Product Identifier",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.countdownapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        url: this._baseUrl() + path,
        params: {
          api_key: this.$auth.api_key,
          ...params,
        },
        ...otherOpts,
      });
    },
    async searchProducts(args = {}) {
      return this._makeRequest({
        path: "/request",
        ...args,
      });
    },
    async getProductData(args = {}) {
      return this._makeRequest({
        path: "/request",
        ...args,
      });
    },
    async getProductReviews(args = {}) {
      return this._makeRequest({
        path: "/request",
        ...args,
      });
    },
  },
};
