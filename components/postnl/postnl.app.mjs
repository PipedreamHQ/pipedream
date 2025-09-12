import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postnl",
  propDefinitions: {
    barcode: {
      type: "string",
      label: "Barcode",
      description: "The barcode of the shipment to track. Eg. `3SABCD123456789`",
    },
    customerCode: {
      type: "string",
      label: "Customer Code",
      description: "The customer code for reference tracking",
      async options() {
        return [
          this.$auth.customer_code,
        ];
      },
    },
    customerNumber: {
      type: "string",
      label: "Customer Number",
      description: "The customer number for reference tracking",
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "The reference number to track",
    },
    detail: {
      type: "boolean",
      label: "Detail",
      description: "Option to include old statuses in the response",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the returned shipment and status descriptions (default is Dutch)",
      options: [
        "NL",
        "EN",
        "CN",
        "DE",
        "FR",
      ],
      optional: true,
    },
    maxDays: {
      type: "integer",
      label: "Max Days",
      description: "Limit the number of days that will be searched (decrease this amount for better performance).",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      const { api_url: baseUrl } = this.$auth;
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "apikey": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, headers, ...config
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...config,
      });
    },
    getStatusByBarcode({
      barcode, ...args
    } = {}) {
      return this.makeRequest({
        path: `/shipment/v2/status/barcode/${barcode}`,
        ...args,
      });
    },
    getStatusByReference(args = {}) {
      return this.makeRequest({
        path: "/shipment/v2/status/reference",
        ...args,
      });
    },
  },
};
