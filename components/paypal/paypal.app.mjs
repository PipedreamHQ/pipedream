import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paypal",
  propDefinitions: {
    paymentEventTypes: {
      label: "Payment Event Types",
      description: "An array of payment events to which to subscribe your webhook",
      type: "string[]",
      optional: false,
      async options() {
        const { event_types: eventsTypes } = await this.getEventsTypes();

        return eventsTypes.filter((event) => event.name.startsWith("PAYMENT.")).map((event) => ({
          value: event.name,
          label: `${event.name} - ${event.description}`,
        }));
      },
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _appType() {
      return this.$auth.app_type;
    },
    _apiUrl() {
      return `${this._appType()}.paypal.com`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/v1/notifications/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/v1/notifications/webhooks/${webhookId}`,
        method: "delete",
      });
    },

    async getWebhooksEvents(args = {}) {
      return this._makeRequest({
        path: "/v1/notifications/webhooks-events",
        ...args,
      });
    },
    async getUserInfo(args = {}) {
      return this._makeRequest({
        path: "/v1/identity/oauth2/userinfo",
        ...args,
      });
    },
    async getEventsTypes(args = {}) {
      return this._makeRequest({
        path: "/v1/notifications/webhooks-event-types",
        ...args,
      });
    },
  },
};
