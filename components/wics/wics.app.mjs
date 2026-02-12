import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wics",
  propDefinitions: {
    orderReference: {
      type: "string",
      label: "Order Reference",
      description: "Reference identifier for the order",
      async options({ page }) {
        const { data } = await this.listOrders({
          params: {
            page: page + 1,
          },
        });
        return data?.filter((order) => order.reference)?.map((order) => ({
          label: `Order #${order.number}`,
          value: order.reference,
        })) || [];
      },
    },
    additionalReference: {
      type: "string",
      label: "Additional Reference",
      description: "Additional reference for the order",
      async options({ page }) {
        const { data } = await this.listOrders({
          params: {
            page: page + 1,
          },
        });
        return data?.filter((order) => order.additionalReference)?.map((order) => ({
          label: `Order #${order.number}`,
          value: order.additionalReference,
        })) || [];
      },
    },
    lineNumber: {
      type: "string",
      label: "Line Number",
      description: "Line number of an order",
      async options({ orderReference }) {
        const { data } = await this.getOrder({
          orderReference,
        });
        return data?.lines?.map((line) => ({
          label: `Line #${line.lineNumber}`,
          value: line.lineNumber,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.environment}servicelayer.wics.nl/api`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.api_key}`,
          password: `${this.$auth.api_secret}`,
        },
        ...opts,
      });
    },
    getOrder({
      orderReference, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderReference}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/order",
        ...opts,
      });
    },
    listOrderShipments({
      orderReference, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderReference}/shipment`,
        ...opts,
      });
    },
    updateOrder({
      orderReference, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderReference}`,
        method: "PUT",
        ...opts,
      });
    },
    deleteOrderLine({
      orderReference, lineNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderReference}/line/${lineNumber}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
