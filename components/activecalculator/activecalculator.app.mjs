import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "activecalculator",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.activecalculator.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async registerWebhook(url, calculators) {
      const data = {
        url,
        triggers: [
          "newSubmission",
        ],
        calculators,
      };
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
    },
    async getAllWebhooks() {
      return this._makeRequest({
        method: "GET",
        path: "/webhooks",
      });
    },
    async getWebhook(webhookId) {
      return this._makeRequest({
        method: "GET",
        path: `/webhooks/${webhookId}`,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    async emitNewSubmissionEvent(event) {
      this.$emit(event, {
        summary: "New Submission",
        id: event.id,
        ts: Date.now(),
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
