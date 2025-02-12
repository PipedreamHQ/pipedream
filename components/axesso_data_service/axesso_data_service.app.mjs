import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "axesso_data_service",
  version: "0.0.{{ts}}",
  propDefinitions: {
    url: {
      type: "string",
      label: "Product URL",
      description: "The URL of the Amazon product to lookup.",
    },
    domainCode: {
      type: "string",
      label: "Domain Code",
      description: "The domain code for product searches.",
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for products.",
    },
    asin: {
      type: "string",
      label: "ASIN",
      description: "The ASIN of the product to lookup reviews.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The sort option for the search or reviews.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category to filter the product search.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of search results to return.",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://axesso.developer.azure-api.net";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    // Requests product detail information
    async requestProductDetail(opts = {}) {
      const {
        url, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: "/product/details",
        params: {
          url: this.url,
        },
        ...otherOpts,
      });
    },
    // Searches products by keyword
    async searchProducts(opts = {}) {
      const {
        domainCode, keyword, sortBy, category, maxResults, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: "/search/products",
        params: {
          domainCode: this.domainCode,
          keyword: this.keyword,
          sortBy: this.sortBy,
          category: this.category,
          maxResults: this.maxResults,
        },
        ...otherOpts,
      });
    },
    // Looks up reviews for a product
    async lookupReviews(opts = {}) {
      const {
        domainCode, asin, sortBy, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: "/product/reviews",
        params: {
          domainCode: this.domainCode,
          asin: this.asin,
          sortBy: this.sortBy,
        },
        ...otherOpts,
      });
    },
    // Handles pagination for listing endpoints
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          page,
          ...opts,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }
      return results;
    },
  },
};
