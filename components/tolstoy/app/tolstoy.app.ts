import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "tolstoy",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.gotolstoy.com";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks/",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
      });
    },
  },
});
