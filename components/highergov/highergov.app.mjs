import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "highergov",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.highergov.com/zapier";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async getAuth(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/auth",
        ...opts,
      });
    },
    async subscribeWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipeline/subscribe/",
        data: {
          target_url: opts.targetUrl,
        },
        ...opts,
      });
    },
    async unsubscribeWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipeline/unsubscribe/",
        ...opts,
      });
    },
    async performList(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/perform/",
        ...opts,
      });
    },
  },
  version: "0.0.{{ts}}",
};
