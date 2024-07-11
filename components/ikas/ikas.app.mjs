import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ikas",
  propDefinitions: {
    webhookEndpoint: {
      type: "string",
      label: "Webhook Endpoint",
      description: "The URL where the webhook will send data.",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "The ID of the webhook",
      async options() {
        const webhooks = await this.listWebhooks();
        return webhooks.map((webhook) => ({
          value: webhook.id,
          label: webhook.endpoint,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return `https://${this.$auth.store_name}.myikas.com/api/admin/graphql`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async createWebhook({
      scopes, endpoint,
    }) {
      return this._makeRequest({
        data: {
          query: `mutation {
            saveWebhook(
              input: {
                scopes: "${scopes}"
                endpoint: "${endpoint}"
              }
            ) {
              createdAt
              deleted
              endpoint
              id
              scope
              updatedAt
            }
          }`,
        },
      });
    },
    async deleteWebhook({ webhookId }) {
      return this._makeRequest({
        data: {
          query: `mutation {
            deleteWebhook(scopes: ["${webhookId}"])
          }`,
        },
      });
    },
    async listWebhooks() {
      return this._makeRequest({
        data: {
          query: `{
            listWebhook {
              createdAt
              deleted
              endpoint
              id
              scope
              updatedAt
            }
          }`,
        },
      });
    },
    async emitCustomerCreatedEvent(customerDetails) {
      this.$emit(customerDetails, {
        name: "Customer Created",
        summary: `New customer created: ${customerDetails.name}`,
      });
    },
    async emitProductListedEvent(productDetails) {
      this.$emit(productDetails, {
        name: "Product Listed",
        summary: `New product listed: ${productDetails.name}`,
      });
    },
    async emitOrderPlacedEvent(orderDetails) {
      this.$emit(orderDetails, {
        name: "Order Placed",
        summary: `New order placed: ${orderDetails.id}`,
      });
    },
  },
};
