import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendblue",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _apiUrl() {
      return "https://api.sendblue.co/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "sb-api-key-id": this._apiKey(),
          "sb-api-secret-key": this._apiSecret(),
        },
        ...args,
      });
    },
    async sendMessage({ ...args }) {
      return this._makeRequest({
        path: "/send-message",
        method: "post",
        ...args,
      });
    },
  },
};
