import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peach",
  methods: {
    _baseUrl() {
      return "https://app.trypeach.io/api/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_token}`,
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
    sendTransactionalMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transactional_messages",
        ...opts,
      });
    },
  },
};
