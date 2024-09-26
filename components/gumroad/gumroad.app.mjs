import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gumroad",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.gumroad.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    async getSales(args = {}) {
      return this._makeRequest({
        path: "/sales",
        ...args,
      });
    },
  },
};
