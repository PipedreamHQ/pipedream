import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shipstation",
  propDefinitions: {
    storeId: {
      label: "Store",
      description: "A list of stores",
      type: "string",
      async options() {
        const stores = await this.getStores();

        return stores.map((store) => ({
          label: store.storeName,
          value: store.storeId,
        }));
      },
    },
    customerEmail: {
      label: "Customer Email",
      description: "A list of customers",
      type: "string",
      async options({ page }) {
        const customers = await this.getCustomers({
          page,
        });

        return customers.map((customer) => customer.email);
      },
    },
  },
  methods: {
    _accessApiKey() {
      return this.$auth.api_key;
    },
    _accessApiSecret() {
      return this.$auth.api_secret;
    },
    _makeAuthorizationKey() {
      return Buffer.from(`${this._accessApiKey()}:${this._accessApiSecret()}`).toString("base64");
    },
    _apiUrl() {
      return "https://ssapi.shipstation.com";
    },
    _headers() {
      return {
        Accept: "application/json",
        Authorization: `Basic ${this._makeAuthorizationKey()}`,
      };
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...options,
      });
    },
    async createWebhook({
      data, $,
    }) {
      return this._makeRequest("webhooks/subscribe", {
        method: "post",
        data,
      }, $);
    },
    async deleteWebhook({
      webhookId, $,
    }) {
      return this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      }, $);
    },
    async getResourceByUrl({
      url, $,
    }) {
      return this._makeRequest("", {
        url,
      }, $);
    },
    async createOrder({
      data, $,
    }) {
      return this._makeRequest("orders/createorder", {
        method: "post",
        data,
      }, $);
    },
    async getStores({ $ } = {}) {
      return this._makeRequest("stores", {}, $);
    },
    async getCustomers({
      params, $,
    } = {}) {
      const response = await this._makeRequest("customers", {
        params: {
          ...params,
          pageSize: 500,
        },
      }, $);

      return response.customers;
    },
  },
};
