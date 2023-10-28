import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mamo_business",
  methods: {
    _apiUrl() {
      return `https://${this.$auth.environment}.mamopay.com/manage_api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...args,
      });
    },
    createPaymentLink(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "links",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${hookId}`,
      });
    },
  },
};
