import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "digitalriver",
  version: "0.0.{{ts}}",
  propDefinitions: {
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
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the customer contact",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { customers } = await this.listCustomers({
          params: {
            page,
          },
        });
        return {
          options: customers.map((customer) => ({
            label: customer.email,
            value: customer.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    customerData: {
      type: "object",
      label: "Customer Data",
      description: "The data to update customer information",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier for the order",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.digitalriver.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createWebhook({
      address, types,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          address,
          types,
        },
      });
    },
    async updateWebhook({
      webhookId, address, types,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/webhooks/${webhookId}`,
        data: {
          address,
          types,
        },
      });
    },
    async createProduct({ productData }) {
      return this._makeRequest({
        method: "POST",
        path: "/products",
        data: productData,
      });
    },
    async updateCustomer({
      contactId, customerData,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customers/${contactId}`,
        data: customerData,
      });
    },
    async cancelOrder({ orderId }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/cancel`,
      });
    },
    async listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
  },
};
