import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "octopush_sms",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.octopush.com/v1/public";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "api-login": `${this.$auth.api_login}`,
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/create",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms-campaign/send",
        ...opts,
      });
    },
  },
};
