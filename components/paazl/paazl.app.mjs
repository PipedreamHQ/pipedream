import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paazl",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier of the order",
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The unique identifier of the shipment",
      async options({
        page, orderId,
      }) {
        const { shipments } = await this.getOrderShipments({
          orderId,
          params: {
            page,
          },
        });

        return shipments.map(({ trackingNumber }) => trackingNumber);
      },
    },
  },
  methods: {
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}:${this.$auth.api_secret}`,
        "Content-Type": "application/json",
        "Accept": "application/json;charset=utf-8",
      };
    },
    _baseUrl() {
      return `${this.$auth.environment}/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };
      return axios($, config);
    },
    getOrderShipments({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/shipments`,
        ...opts,
      });
    },
    getOrderShipmentDetails({
      orderId, shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/shipments/${shipmentId}`,
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        path: "/order",
        method: "POST",
        ...opts,
      });
    },
    createShipment({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/shipments`,
        method: "POST",
        ...opts,
      });
    },
  },
};
