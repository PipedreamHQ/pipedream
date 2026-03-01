import { Polar } from "@polar-sh/sdk";

export default {
  type: "app",
  app: "polar",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The organization ID. Required unless using an organization-scoped access token.",
      optional: true,
    },
  },
  methods: {
    _getAccessToken() {
      const token = this.$auth?.oauth_access_token;
      if (!token) {
        throw new Error(
          "Polar OAuth access token is missing. Connect your Polar account to provide the token. See [Polar OAT docs](https://polar.sh/docs/api-reference/introduction).",
        );
      }
      return token;
    },
    _getClient() {
      return new Polar({
        accessToken: this._getAccessToken(),
      });
    },
    async createWebhookEndpoint({
      url,
      events,
      organizationId,
      format = "raw",
    }) {
      const client = this._getClient();
      return client.webhooks.createWebhookEndpoint({
        url,
        format,
        events,
        ...(organizationId && {
          organizationId,
        }),
      });
    },
    async deleteWebhookEndpoint(endpointId) {
      const client = this._getClient();
      return client.webhooks.deleteWebhookEndpoint({
        id: endpointId,
      });
    },
    async listOrders(params = {}) {
      const client = this._getClient();
      try {
        const iterator = await client.orders.list(params);
        let result;
        for await (const page of iterator) {
          result = page.result;
          break;
        }
        return result ?? {
          items: [],
          pagination: null,
        };
      } finally {
        if (client.close) await client.close();
      }
    },
    async listSubscriptions(params = {}) {
      const client = this._getClient();
      try {
        const iterator = await client.subscriptions.list(params);
        let result;
        for await (const page of iterator) {
          result = page.result;
          break;
        }
        return result ?? {
          items: [],
          pagination: null,
        };
      } finally {
        if (client.close) await client.close();
      }
    },
  },
};
