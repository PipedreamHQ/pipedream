import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "totango",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.totango.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "app-token": this._apiKey(),
        },
        ...args,
      });
    },
    async searchAccounts({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/search/accounts",
        method: "post",
        ...args,
      });

      return response?.response?.accounts?.hits;
    },
    async searchUsers({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/search/users",
        method: "post",
        ...args,
      });

      return response?.response?.users?.hits;
    },
  },
};
