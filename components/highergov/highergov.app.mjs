import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "highergov",
  methods: {
    _baseUrl() {
      return "https://www.highergov.com/zapier";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    subscribeWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipeline/subscribe/",
        ...opts,
      });
    },
    unsubscribeWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipeline/unsubscribe/",
        ...opts,
      });
    },
  },
};
