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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createInvoice({
      customerId, billingAddress, transactionDetails, dueDate = null, notes = null,
    }) {
      return this._makeRequest({
        path: "/invoices",
        data: {
          customer_id: customerId,
          billing_address: billingAddress,
          transaction_details: transactionDetails,
          due_date: dueDate,
          notes,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
