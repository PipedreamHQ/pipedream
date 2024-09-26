import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "oncehub",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.oncehub.com/v2";
    },
    _headers() {
      return {
        "API-Key": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
  },
};
