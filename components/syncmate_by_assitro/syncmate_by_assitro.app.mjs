import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "syncmate_by_assitro",
  methods: {
    _baseUrl() {
      return "https://app.assistro.co/api/v1/wapushplus";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    sendSingleMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/single/message",
        ...opts,
      });
    },
    sendBulkMessages(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/bulk/message",
        ...opts,
      });
    },
  },
};
