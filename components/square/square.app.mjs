import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "square",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://connect.squareup.com/v2";
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          Authorization: "Bearer " + this._auth(),
        },
      });
    },
    async createWebhook({
      eventTypes, name, url,
    }) {
      return this._makeRequest({
        path: "/webhooks/subscriptions",
        method: "post",
        data: {
          subscription: {
            name,
            event_types: eventTypes,
            notification_url: url,
          },
        },
      });
    },
    async deleteWebhook({ id }) {
      return this._makeRequest({
        path: `/webhooks/subscriptions/${id}`,
        method: "delete",
      });
    },
  },
};
