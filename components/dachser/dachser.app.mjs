import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dachser",
  propDefinitions: {
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: `The shipment tracking number. The search can be done by:

- DACHSER Customer order number
- consignment number
- Delivery Note Number
- Purchase Order Number
- SSCC (bar codes)
- House Bill of Lading (HB/L)
- House AirWay Bill (HAWB)
- Container number
- Invoice Number
- Batch Number
- Packing List Number.
      `,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Your Dachser customer identifier. Separate multiple values by comma.",
      optional: true,
    },
    acceptLanguage: {
      type: "string",
      label: "Accept-Language",
      description: "Translation of service code descriptions. (ISO 639-1 standard language codes.) Examples: `en-US`, `de-DE`, `fr-FR`.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api-gateway.dachser.com/rest/v2${path}`;
    },
    headers(headers) {
      const { api_token: apiToken } = this.$auth;
      return {
        "Accept": "application/json",
        "X-API-Key": apiToken,
        "Accept-Language": "en-US",
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.headers(headers),
      });
    },
    getShipmentStatus(args = {}) {
      return this.makeRequest({
        path: "/shipmentstatus",
        ...args,
      });
    },
    getShipmentHistory(args = {}) {
      return this.makeRequest({
        path: "/shipmenthistory",
        ...args,
      });
    },
    getDeliveryOrderStatus(args = {}) {
      return this.makeRequest({
        path: "/deliveryorderstatus",
        ...args,
      });
    },
  },
};
