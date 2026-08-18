import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailtrap",
  propDefinitions: {},
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token || this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _httpRequest({
      $ = this,
      baseURL = "https://send.api.mailtrap.io",
      endpoint,
      ...customConfig
    }) {
      return axios($, {
        url: `${baseURL}${endpoint}`,
        headers: this._getHeaders(),
        ...customConfig,
      });
    },
    async sendEmail(args = {}) {
      const {
        $, data,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://send.api.mailtrap.io",
        endpoint: "/api/send",
        method: "POST",
        data,
      });
    },
    async getEmailState(args = {}) {
      const {
        $, sendingMessageId,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: `/api/email_logs/${sendingMessageId}`,
        method: "GET",
      });
    },
  },
};
