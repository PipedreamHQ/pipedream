import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "delivery_march",
  propDefinitions: {
    shipmentId: {
      type: "integer",
      label: "Shipment ID",
      description: "The ID of the shipment to get status for",
      optional: true,
      async options() {
        const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
          .toLocaleDateString();
        const { shipments } = await this.getShipments({
          data: {
            dateFrom: sixMonthsAgo,
            dateTo: new Date().toISOString()
              .slice(0, 10), // YYYY-MM-DD
          },
        });
        return shipments?.map(({ id }) => ({
          label: `Shipment ID: ${id}`,
          value: id,
        })) || [];
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number to get status for",
      optional: true,
      async options() {
        const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
          .toLocaleDateString();
        const { shipments } = await this.getShipments({
          data: {
            dateFrom: sixMonthsAgo,
            dateTo: new Date().toISOString()
              .slice(0, 10), // YYYY-MM-DD
          },
        });
        return shipments?.map(({ orderNumber }) => orderNumber) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/api/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          apikey: this.$auth.api_key,
          client: this.$auth.client_id,
        },
      });
    },
    getStatus(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/getStatus",
        ...opts,
      });
    },
    getShipments(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/getShipments",
        ...opts,
      });
    },
  },
};
