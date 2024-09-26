import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "phaxio",
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _apiUrl() {
      return "https://api.phaxio.com/v2.1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: this._apiSecret(),
        },
        ...args,
      });
    },
    async sendFax({ ...args }) {
      return this._makeRequest({
        path: "/faxes",
        method: "post",
        ...args,
      });
    },
  },
};
