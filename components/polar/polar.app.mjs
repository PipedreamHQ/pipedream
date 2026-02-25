import { Polar } from "@polar-sh/sdk";

export default {
  type: "app",
  app: "polar",
  propDefinitions: {
    organisation_access_token: {
      type: "string",
      label: "Organization Access Token",
      description: "Your Polar Organization Access Token (OAT). Create one in your [organization settings](https://polar.sh/dashboard).",
      secret: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The organization ID. Required unless using an organization-scoped access token.",
      optional: true,
    },
  },
  methods: {
    _getAccessToken() {
      const token = this._organisationAccessTokenOverride || this.organisation_access_token;
      if (!token) {
        throw new Error(
          "Polar Organization Access Token (OAT) is missing. Set the \"Organization Access Token\" prop or connect your Polar account. See [Polar OAT docs](https://polar.sh/docs/api-reference/introduction).",
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
      } catch (error) {
        console.error("error listing orders", error);
        throw error;
      } finally {
        if (client.close) await client.close();
      }
    },
    async listSubscriptions(params = {}) {
      const client = this._getClient();
      try {
        const iterator = await client.subscriptions.list(params);
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
      } catch (error) {
        console.error("error listing subscriptions", error);
        throw error;
      } finally {
        if (client.close) await client.close();
      }
    },
  },
};
