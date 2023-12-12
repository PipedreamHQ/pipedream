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
      return "https://api.totango.com/api";
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
    async searchAccounts(args = {}) {
      const { response } = await this._makeRequest({
        path: "/v1/search/accounts",
        method: "post",
        ...args,
      });

      return response?.accounts?.hits;
    },
    async searchUsers(args = {}) {
      const { response } = await this._makeRequest({
        path: "/v1/search/users",
        method: "post",
        ...args,
      });

      return response?.users?.hits;
    },
    async searchEvents(args = {}) {
      const { response } = await this._makeRequest({
        path: "/v2/events/search",
        method: "post",
        ...args,
      });

      return response?.events?.hits;
    },
  },
};
