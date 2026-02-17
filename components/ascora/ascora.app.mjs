import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ascora",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.ascora.com.au";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Auth: this.$auth.api_key,
        },
        ...opts,
      });
    },
    searchCustomers(opts = {}) {
      return this._makeRequest({
        path: "/Customers/Customers",
        ...opts,
      });
    },
  },
};
