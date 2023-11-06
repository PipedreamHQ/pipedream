import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "starshipit",
  propDefinitions: {
    orderDetails: {
      type: "object",
      label: "Order Details",
      description: "The details of the order to create",
    },
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the order",
      async options() {
        const shippedOrders = await this.listShippedOrders();
        return shippedOrders.map((order) => ({
          value: order.trackingNumber,
          label: order.orderNumber,
        }));
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number to print a shipping label",
      async options() {
        const unshippedOrders = await this.listUnshippedOrders();
        return unshippedOrders.map((order) => ({
          value: order.orderNumber,
          label: order.orderNumber,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.starshipit.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createOrder(orderDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        data: orderDetails,
      });
    },
    async getTrackingDetails(trackingNumber) {
      return this._makeRequest({
        path: `/tracking/${trackingNumber}`,
      });
    },
    async printShippingLabel(orderNumber) {
      return this._makeRequest({
        path: `/orders/${orderNumber}/label`,
      });
    },
    async listShippedOrders() {
      return this._makeRequest({
        path: "/orders?status=shipped",
      });
    },
    async listUnshippedOrders() {
      return this._makeRequest({
        path: "/orders?status=unshipped",
      });
    },
  },
};