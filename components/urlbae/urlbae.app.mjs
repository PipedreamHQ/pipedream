import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "urlbae",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://urlbae.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createQrcode(args = {}) {
      return this._makeRequest({
        path: "/qr/add",
        method: "post",
        ...args,
      });
    },
    async shortenUrl(args = {}) {
      return this._makeRequest({
        path: "/url/add",
        method: "post",
        ...args,
      });
    },
  },
};
