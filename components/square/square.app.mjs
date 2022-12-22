import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "square",
  propDefinitions: {
    eventTypes: {
      type: "string[]",
      label: "Webhook Event Types",
      description: "Custom webhook event types. [See docs here](https://developer.squareup.com/docs/webhooks/v2webhook-events-tech-ref).",
      async options() {
        const { event_types } = await this.listWebhookEventTypes();
        return event_types;
      },
    },
  },
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
    async listWebhookEventTypes() {
      return this._makeRequest({
        path: "/webhooks/event-types",
      });
    },
  },
};
