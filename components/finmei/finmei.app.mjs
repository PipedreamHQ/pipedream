import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "finmei",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      description: "The billing address for the invoice.",
    },
    transactionDetails: {
      type: "string",
      label: "Transaction Details",
      description: "Details of the transaction for the invoice.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the invoice payment.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes for the invoice.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.finmei.com";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createInvoice(args) {
      return this._makeRequest({
        method: "post",
        url: "/invoices",
        ...args,
      });
    },
  },
};
