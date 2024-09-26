import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bunnydoc",
  methods: {
    _baseUrl() {
      return "https://api.bunnydoc.com/v1";
    },
    _headers() {
      return {
        "Authorization": `API-KEY ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    createSignatureRequestFromTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createSignatureRequestFromTemplate",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribeWebhook",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/unsubscribeWebhook/${webhookId}`,
      });
    },
  },
};
