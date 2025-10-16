import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "walletap",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api.walletap.io";
    },
    _getHeaders() {
      return {
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    createPass(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pass",
        ...args,
      });
    },
    getPass(args = {}) {
      return this._makeRequest({
        path: "/pass",
        ...args,
      });
    },
    updatePass(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/pass",
        ...args,
      });
    },
    sendNotification(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/template/${this.$auth.template_id}/notification`,
        ...args,
      });
    },
  },
};
