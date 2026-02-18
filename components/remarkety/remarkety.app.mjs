import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "remarkety",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://app.remarkety.com/api/v2/stores/${this.$auth.store_id}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-Key": `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    createDiscount(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/discounts",
        ...opts,
      });
    },
  },
};
