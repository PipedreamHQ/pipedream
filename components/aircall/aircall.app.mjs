import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aircall",
  propDefinitions: {
    call: {
      type: "string",
      label: "Call",
      description: "Select a call",
      async options({ page }) {
        const { calls } = await this.listCalls({
          page,
        });
        return calls.map((call) => ({
          label: call.raw_digits,
          value: call.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.aircall.io/v1/";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this._authToken()}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        data,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${id}`,
      });
    },
    async getCall(id, $) {
      return this._makeRequest({
        path: `calls/${id}`,
        $,
      });
    },
    async listCalls(params = {}, $) {
      return this._makeRequest({
        path: "calls",
        params,
        $,
      });
    },
  },
};
