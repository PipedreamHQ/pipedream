import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bluecart_api",
  propDefinitions: {
    walmartDomain: {
      type: "string",
      label: "Walmart Domain",
      description: "The Walmart domain to target",
      options: constants.DOMAIN_OPTIONS,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The Walmart product page URL to retrieve results from",
      optional: true,
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "A search term used to find Walmart items",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The Walmart Item ID to retrieve product details for. Not used if a URL is provided",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bluecartapi.com";
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
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async getCategories(args = {}) {
      return this._makeRequest({
        path: "/categories",
        ...args,
      });
    },
    async searchItem(args = {}) {
      return this._makeRequest({
        path: "/request",
        ...args,
      });
    },
    async getAutocomplete(args = {}) {
      return this._makeRequest({
        path: "/request",
        ...args,
      });
    },
  },
};
