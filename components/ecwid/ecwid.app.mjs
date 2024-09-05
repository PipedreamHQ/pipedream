import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "ecwid",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.client_secret;
    },
    _apiUrl() {
      return `https://app.ecwid.com/api/v3/${this.$auth.storeId}`;
    },

    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "accept": "application/json",
          "Authorization": `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getOrder(orderId) {
      return await this._makeRequest({
        path: `/orders/${orderId}`,
        method: "GET",
      });
    },
    async getOrders(history = 30, paymentStatus = "PAID", fulfilmentStatus = "AWAITING_PROCESSING") {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - history);
      const fromDateTimeStamp = Math.floor(fromDate.getTime() / 1000).toString();
      return this._makeRequest({
        path: "/orders",
        method: "GET",
        params: {
          "paymentStatus": paymentStatus,
          "fulfillmentStatus": fulfilmentStatus,
          "createdFrom": fromDateTimeStamp,
        },
      });
    },
    async updateFulfilmentStatus(orderId, fulfilmentStatus = "PROCESSING") {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        method: "PUT",
        data: {
          "fulfillmentStatus": fulfilmentStatus,
        },
      });
    },
  },
};
