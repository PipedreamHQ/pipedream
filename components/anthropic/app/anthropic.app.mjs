import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anthropic",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.anthropic.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "x-api-key": this._apiKey(),
          "anthropic-version": "2023-06-01",
        },
        ...args,
      });
    },
    async createChatCompletion(args = {}) {
      return this._makeRequest({
        path: "/complete",
        method: "post",
        ...args,
      });
    },
  },
};
