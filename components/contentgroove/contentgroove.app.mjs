import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contentgroove",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.contentgroove.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
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
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook_subscriptions",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook_subscriptions/${webhookId}`,
      });
    },
    listProcessedMedia(opts = {}) {
      return this._makeRequest({
        path: "/medias",
        ...opts,
      });
    },
  },
};
