import { ConfigurationError } from "@pipedream/platform";
import { Polar } from "@polar-sh/sdk";

export default {
  type: "app",
  app: "polar",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Provide the organization ID (UUID). Find it in [Settings → General](https://polar.sh/dashboard/getalong/settings) under **Identifier**.",
    },
    productId: {
      type: "string",
      label: "Product",
      description: "Select a product or provide a custom Product ID (UUID). Search by product name or Product ID (UUID).",
      optional: true,
      useQuery: true,
      async options(opts) {
        return this._fetchListOptions(
          (client, params) => client.products.list(params),
          ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          opts,
        );
      },
    },
    customerId: {
      type: "string",
      label: "Customer",
      description: "Select a customer or provide a custom Customer ID (UUID). Search by name, or Customer ID (UUID).",
      optional: true,
      useQuery: true,
      async options(opts) {
        return this._fetchListOptions(
          (client, params) => client.customers.list(params),
          ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          opts,
        );
      },
    },
  },
  methods: {
    _getAccessToken() {
      const token = this.$auth?.oauth_access_token;
      if (!token) {
        throw new ConfigurationError(
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
    async _fetchListOptions(listFn, itemMapper, {
      page = 0, query, organizationId,
    } = {}) {
      const client = this._getClient();
      try {
        const params = {
          page: page + 1,
          limit: 20,
          ...(query && {
            query,
          }),
          ...(organizationId && {
            organizationId,
          }),
        };
        const iterator = await listFn(client, params);
        const items = [];
        for await (const p of iterator) {
          items.push(...p.result.items);
          break;
        }
        return items.map(itemMapper);
      } finally {
        if (client.close) await client.close();
      }
    },
    async createWebhookEndpoint({
      url,
      events,
      organizationId,
      format = "raw",
    }) {
      const client = this._getClient();
      try {
        return await client.webhooks.createWebhookEndpoint({
          url,
          format,
          events,
          organizationId,
        });
      } finally {
        if (client.close) await client.close();
      }
    },
    async deleteWebhookEndpoint(endpointId) {
      const client = this._getClient();
      try {
        return await client.webhooks.deleteWebhookEndpoint({
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
      const {
        organizationId, ...rest
      } = params;
      return this._listWithAutoPagination(
        (client, p) => client.orders.list(p),
        {
          ...rest,
          organizationId,
        },
      );
    },
    async listSubscriptions(params = {}) {
      const {
        organizationId, ...rest
      } = params;
      return this._listWithAutoPagination(
        (client, p) => client.subscriptions.list(p),
        {
          ...rest,
          organizationId,
        },
      );
    },
  },
};
