import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faktoora",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The unique identifier for the invoice.",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the invoice (ZUGFeRD/xrechnung).",
      options: [
        {
          label: "ZUGFeRD",
          value: "ZUGFeRD",
        },
        {
          label: "xrechnung",
          value: "xrechnung",
        },
      ],
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The invoice number.",
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "The issue date of the invoice (YYYY-MM-DD).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the invoice.",
    },
    buyerName: {
      type: "string",
      label: "Buyer Name",
      description: "The name of the buyer.",
      optional: true,
    },
    sellerName: {
      type: "string",
      label: "Seller Name",
      description: "The name of the seller.",
      optional: true,
    },
    totalAmount: {
      type: "number",
      label: "Total Amount",
      description: "The total amount of the invoice.",
      optional: true,
    },
    taxAmount: {
      type: "number",
      label: "Tax Amount",
      description: "The total tax amount of the invoice.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.faktoora.com/api/v1";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createInvoice({
      format, invoiceNumber, issueDate, currency, ...otherProps
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: {
          format,
          invoiceNumber,
          issueDate,
          currency,
          ...otherProps,
        },
      });
    },
    async fetchInvoice({ invoiceId }) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}`,
      });
    },
  },
};
