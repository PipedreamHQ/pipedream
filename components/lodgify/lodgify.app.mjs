import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lodgify",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.lodgify.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "X-ApiKey": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/v1/subscribe",
        ...opts,
      });
    },
    async deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks/v1/unsubscribe",
        ...opts,
      });
    },
  },
};
