import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserless",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      if (!this.$auth.base_url) {
        throw new ConfigurationError("Please reconnect your Browserless account because there are recent changes in Browserless API");
      }
      return `https://${this.$auth.base_url}`;
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
    convertHtmlToPdf(opts = {}) {
      return this._makeRequest({
        path: "/pdf",
        method: "post",
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
