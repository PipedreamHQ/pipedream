import { axios } from "@pipedream/platform";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "digitalriver",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
      async options({ prevContext }) {
        const { data } = await this.listCustomers({
          params: {
            startingAfer: prevContext.startingAfer,
          },
        });

        const lastItem = data.slice(-1);

        return {
          options: data.map(({
            id: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            startingAfer: lastItem.id,
          },
        };
      },
    },
    fileId: {
      type: "string",
      label: "File Id",
      description: "The identifier of the file.",
      async options({ prevContext }) {
        const { data } = await this.listFiles({
          params: {
            startingAfer: prevContext.startingAfer,
          },
        });

        const lastItem = data.slice(-1);

        return {
          options: data.map(({
            id: value, title, fileName,
          }) => ({
            label: title || fileName,
            value,
          })),
          context: {
            startingAfer: lastItem.id,
          },
        };
      },
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Key-value pairs used to store additional data. Value can be string, boolean or integer types.",
    },
    orderId: {
      type: "string",
      label: "Fulfillment Order ID",
      description: "The unique identifier of the fulfillment order associated with the fulfillment cancellation.",
      async options({ prevContext }) {
        const { data } = await this.listOrders({
          params: {
            startingAfer: prevContext.startingAfer,
          },
        });

        const lastItem = data.slice(-1);

        return {
          options: data.map(({
            id: value, email,
          }) => ({
            label: `${email} - ${value}`,
            value,
          })),
          context: {
            startingAfer: lastItem.id,
          },
        };
      },
    },
    skuGroupId: {
      type: "string",
      label: "Sku Group Id",
      description: "The unique identifier of the Sku Group.",
      async options({ prevContext }) {
        const { data } = await this.listSkuGroups({
          params: {
            startingAfer: prevContext.startingAfer,
          },
        });

        const lastItem = data.slice(-1);

        return {
          options: data.map(({
            id: value, alias: label,
          }) => ({
            label,
            value,
          })),
          context: {
            startingAfer: lastItem.id,
          },
        };
      },
    },
    webhookAddress: {
      type: "string",
      label: "Webhook Address",
      description: "The URL to send webhook events to",
    },
    webhookTypes: {
      type: "string[]",
      label: "Webhook Types",
      description: "The types of events to subscribe to for the webhook",
      default: [
        "order.complete",
        "order.pending_payment",
        "order.charge.*",
      ],
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product",
    },
    productData: {
      type: "object",
      label: "Product Data",
      description: "The data for the new product",
    },
    customerData: {
      type: "object",
      label: "Customer Data",
      description: "The data to update customer information",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.digitalriver.com";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, clearObj({
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      }));
    },
    getOrderDetails({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listSkuGroups(opts = {}) {
      return this._makeRequest({
        path: "/sku-groups",
        ...opts,
      });
    },

    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },

    updateWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/webhooks/${webhookId}`,
        ...opts,
      });
    },
    createProduct(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/skus",
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    cancelOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/fulfillments",
        ...opts,
      });
    },
  },
};
