import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserless",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://chrome.browserless.io";
    },
    _auth() {
      return {
        token: this.$auth.api_key,
      };
    },
    _headers() {
      return {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $, path = "", ...opts
    }) {
      return axios($, {
        ...opts,
        headers: {
          ...this._headers(),
          ...opts.headers,
        },
        params: {
          ...this._auth(),
          ...opts.params,
        },
        url: this._baseUrl() + path,
      });
    },
    async scrape(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/scrape",
        method: "post",
      });
    },
    takeScreenshot(opts = {}) {
      return this._makeRequest({
        path: "/screenshot",
        method: "post",
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
