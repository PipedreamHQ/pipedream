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
      try {
        return client.webhooks.createWebhookEndpoint({
          url,
          format,
          events,
          ...(organizationId && {
            organizationId,
          }),
        });
      } finally {
        if (client.close) await client.close();
      }
    },
    async deleteWebhookEndpoint(endpointId) {
      const client = this._getClient();
      try {
        return client.webhooks.deleteWebhookEndpoint({
          id: endpointId,
        });
      } finally {
        if (client.close) await client.close();
      }
    },
    async _listWithAutoPagination(listFn, params = {}) {
      const client = this._getClient();
      try {
        const iterator = await listFn(client, params);
        const items = [];
        let pagination;
        for await (const page of iterator) {
          items.push(...page.result.items);
          pagination = page.result.pagination;
        }
        return {
          items,
          pagination,
        };
      } finally {
        if (client.close) await client.close();
      }
    },
    async listOrders(params = {}) {
      return this._listWithAutoPagination((client, p) => client.orders.list(p), params);
    },
    async listSubscriptions(params = {}) {
      return this._listWithAutoPagination((client, p) => client.subscriptions.list(p), params);
    },
  },
};
