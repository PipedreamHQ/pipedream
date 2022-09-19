import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "squarespace",
  propDefinitions: {
    storePageId: {
      label: "Store Page ID",
      description: "The ID of the store page",
      type: "string",
      async options() {
        const storePages = await this.getStorePages() ?? [];

        return storePages.map((storePage) => ({
          label: storePage.title,
          value: storePage.id,
        }));
      },
    },
    productId: {
      label: "Product ID",
      description: "The ID of the product",
      type: "string",
      async options() {
        const products = await this.getProducts() ?? [];

        return products.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
    },
    orderId: {
      label: "Order ID",
      description: "The ID of the order",
      type: "string",
      async options() {
        const orders = await this.getOrders() ?? [];

        return orders.map((order) => ({
          label: order.orderNumber,
          value: order.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.squarespace.com/1.0";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createWebhook(data) {
      return this._makeRequest("webhook_subscriptions", {
        method: "post",
        data,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhook_subscriptions/${webhookId}`, {
        method: "delete",
      });
    },
    async getAllResources({
      path, resourceName, params, $,
    }) {
      let resources = [];

      let nextPageCursor;

      do {
        const _params = params ?? {};

        if (nextPageCursor) _params.cursor = nextPageCursor;
        const response = await this._makeRequest(path, {
          _params,
        }, $);

        resources = resources.concat(response[resourceName]);

        nextPageCursor = response?.pagination?.nextPageCursor;
      } while (nextPageCursor);

      return resources;
    },
    async getTransactions({
      $, params,
    } = {}) {
      return this.getAllResources({
        path: "commerce/transactions",
        resourceName: "documents",
        params,
        $,
      });
    },
    async getStorePages({ $ } = {}) {
      return this.getAllResources({
        path: "commerce/store_pages",
        resourceName: "storePages",
        $,
      });
    },
    async getOrders({ $ } = {}) {
      return this.getAllResources({
        path: "commerce/orders",
        resourceName: "result",
        $,
      });
    },
    async getOrder({
      orderId, $,
    }) {
      return this._makeRequest(`commerce/orders/${orderId}`, $);
    },
    async getProducts({
      $, params,
    } = {}) {
      return this.getAllResources({
        path: "commerce/products",
        resourceName: "products",
        params,
        $,
      });
    },
    async getProduct({
      productId, $,
    }) {
      const response = await this._makeRequest(`commerce/products/${productId}`, $);

      return response.products;
    },
    async createProduct({
      $, data,
    }) {
      return this._makeRequest("commerce/products", {
        method: "post",
        data,
      }, $);
    },
  },
};
