import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "barcode_lookup",
  propDefinitions: {
    barcode: {
      type: "string",
      label: "Barcode",
      description: "Barcode to search, must be 7, 8, 10, 11, 12, 13 or 14 digits long, i.e.: `865694301167`",
      optional: true,
    },
    mpn: {
      type: "string",
      label: "MPN",
      description: "Manufacturer Part Number of the product, i.e: `LXCF9407`",
      optional: true,
    },
    asin: {
      type: "string",
      label: "ASIN",
      description: "Amazon Standard Identification Number of the product, i.e.: `B079L4WR4T`",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Product title or name, i.e.: `Red Running Shoes`",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category or type of the product, i.e.: `Home & Garden > Decor`",
      optional: true,
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "Name of the product manufacturer, i.e.: `Samsung`",
      optional: true,
    },
    brand: {
      type: "string",
      label: "Brand",
      description: "Brand associated with the product, i.e.: `Calvin Klein`",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "General search term for products, i.e.: `Air Jordan Red Shoes Size 40`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.barcodelookup.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    async getRateLimits(args = {}) {
      return this._makeRequest({
        path: "/rate-limits",
        ...args,
      });
    },
  },
};
