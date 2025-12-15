import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upsales",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://integration.upsales.com/api/v2/master";
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.api_key,
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/users",
        ...args,
      });
    },
  },
};
