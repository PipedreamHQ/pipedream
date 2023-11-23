import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "printify",
  propDefinitions: {
    shopId: {
      type: "string",
      label: "Shop ID",
      description: "The ID of the merchant's store.",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "The unique identifier for the webhook.",
    },
    topic: {
      type: "string",
      label: "Webhook Topic",
      description: "The event that triggers the webhook.",
      async options() {
        return [
          {
            label: "Shop Disconnected",
            value: "shop:disconnected",
          },
          {
            label: "Product Deleted",
            value: "product:deleted",
          },
          {
            label: "Product Publish Started",
            value: "product:publish:started",
          },
          {
            label: "Order Created",
            value: "order:created",
          },
          {
            label: "Order Updated",
            value: "order:updated",
          },
          {
            label: "Order Sent to Production",
            value: "order:sent-to-production",
          },
          {
            label: "Order Shipment Created",
            value: "order:shipment:created",
          },
          {
            label: "Order Shipment Delivered",
            value: "order:shipment:delivered",
          },
        ];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product.",
    },
    productBlueprint: {
      type: "object",
      label: "Product Blueprint",
      description: "The blueprint of the product to create.",
      optional: true,
    },
    productDetails: {
      type: "object",
      label: "Product Details",
      description: "The details of the product to create or update.",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the product to order.",
      optional: true,
    },
    shippingDetails: {
      type: "object",
      label: "Shipping Details",
      description: "The shipping details for the order.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL the webhook subscription should send the POST request to.",
      optional: true,
    },
    webhookSecret: {
      type: "string",
      label: "Webhook Secret",
      description: "The secret used to sign requests for the webhook.",
      optional: true,
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "URLs of images associated with the product.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printify.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async listWebhooks({ shopId }) {
      return this._makeRequest({
        path: `/shops/${shopId}/webhooks.json`,
      });
    },
    async createWebhook({
      shopId, topic, url, secret,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shops/${shopId}/webhooks.json`,
        data: {
          topic,
          url,
          secret,
        },
      });
    },
    async updateWebhook({
      shopId, webhookId, url,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/shops/${shopId}/webhooks/${webhookId}.json`,
        data: {
          url,
        },
      });
    },
    async deleteWebhook({
      shopId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/shops/${shopId}/webhooks/${webhookId}.json`,
      });
    },
    async createProduct({
      shopId, productBlueprint, productDetails, images,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shops/${shopId}/products.json`,
        data: {
          blueprint: productBlueprint,
          details: productDetails,
          images,
        },
      });
    },
    async updateProduct({
      shopId, productId, productDetails,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/shops/${shopId}/products/${productId}.json`,
        data: productDetails,
      });
    },
    async placeOrder({
      shopId, productId, quantity, shippingDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/orders.json",
        data: {
          shop_id: shopId,
          line_items: [
            {
              product_id: productId,
              quantity: quantity || 1,
            },
          ],
          shipping_details: shippingDetails,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
