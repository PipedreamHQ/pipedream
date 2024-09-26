import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faktoora",
  propDefinitions: {
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The invoice number.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.faktoora.com/api/v1`;
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        ...opts,
      });
    },
    fetchInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
  },
};
