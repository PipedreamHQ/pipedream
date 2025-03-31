import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quriiri",
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendsms",
        ...opts,
      });
    },
  },
};
