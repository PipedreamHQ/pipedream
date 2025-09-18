import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "redcircle_api",
  propDefinitions: {
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for a category",
      optional: true,
    },
    zipcode: {
      type: "string",
      label: "Zipcode",
      description: "Description for zipcode",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Description for domain",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.redcircleapi.com";
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
    async searchCategories(args = {}) {
      return this._makeRequest({
        path: "/categories",
        ...args,
      });
    },
    async getAccountData(args = {}) {
      return this._makeRequest({
        path: "/account",
        ...args,
      });
    },
    async addZipcode(args = {}) {
      return this._makeRequest({
        path: "/zipcodes",
        method: "post",
        ...args,
      });
    },
  },
};
