import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reply_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.reply.io/api/v2";
    },
    _headers() {
      return {
        "X-Api-Key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest(args = {}) {
      const {
        $ = this,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    async deleteWebhook(hookId, args = {}) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
