import { axios } from '@pipedream/platform'

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
      const response = await this._makeRequest({
        path: "/products",
        ...args
      })

      return response.products
    },
    async getSales(args = {}) {
      this._makeRequest({
        path: "/sales",
        ...args
      })
    }
  },
};
