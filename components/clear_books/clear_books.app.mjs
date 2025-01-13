import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clear_books",
  propDefinitions: {
    // Triggers
    invoiceStatusFilter: {
      type: "string",
      label: "Invoice Status Filter",
      description: "Filter invoices by status (e.g., draft, sent, paid)",
      optional: true,
    },
    paymentMethodFilter: {
      type: "string",
      label: "Payment Method Filter",
      description: "Filter payments by payment method",
      optional: true,
    },
    invoiceReferenceFilter: {
      type: "string",
      label: "Invoice Reference Filter",
      description: "Filter payments by invoice reference",
      optional: true,
    },
    clientTagsFilter: {
      type: "string[]",
      label: "Client Tags Filter",
      description: "Filter clients by specific tags",
      optional: true,
    },
    clientTypesFilter: {
      type: "string",
      label: "Client Types Filter",
      description: "Filter clients by specific types",
      optional: true,
    },
    // Actions - Create Invoice
    createInvoiceClientDetails: {
      type: "string[]",
      label: "Client Details",
      description: "Details of the client. Each detail should be a JSON string.",
    },
    createInvoiceLineItems: {
      type: "string[]",
      label: "Line Items",
      description: "Line items for the invoice. Each item should be a JSON string.",
    },
    createInvoiceIssueDate: {
      type: "string",
      label: "Issue Date",
      description: "Date when the invoice is issued.",
    },
    createInvoiceNotes: {
      type: "string",
      label: "Notes",
      description: "Optional notes for the invoice.",
      optional: true,
    },
    createInvoiceDueDate: {
      type: "string",
      label: "Due Date",
      description: "Optional due date for the invoice.",
      optional: true,
    },
    createInvoiceTags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the invoice.",
      optional: true,
    },
    // Actions - Record Payment
    recordPaymentAmount: {
      type: "number",
      label: "Payment Amount",
      description: "Amount of the payment.",
    },
    recordInvoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "ID of the invoice to record the payment against.",
    },
    recordPaymentDate: {
      type: "string",
      label: "Payment Date",
      description: "Date when the payment was made.",
    },
    recordPaymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Optional payment method.",
      optional: true,
    },
    // Actions - Create Client
    createClientName: {
      type: "string",
      label: "Client Name",
      description: "Name of the client.",
    },
    createClientContactDetails: {
      type: "string[]",
      label: "Contact Details",
      description: "Contact details for the client. Each detail should be a JSON string.",
    },
    createClientNotes: {
      type: "string",
      label: "Notes",
      description: "Optional notes for the client.",
      optional: true,
    },
    createClientTags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the client.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.clearbooks.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
        data,
        params,
        ...otherOpts,
      });
    },
    // Auxiliary Methods
    async listInvoices(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/invoices",
        params: opts,
      });
    },
    async getInvoice(opts = {}) {
      const { invoiceId } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/invoices/${invoiceId}`,
      });
    },
    async createInvoice(data) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data,
      });
    },
    async listPayments(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/payments",
        params: opts,
      });
    },
    async getPayment(opts = {}) {
      const { paymentId } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/payments/${paymentId}`,
      });
    },
    async recordPayment(data) {
      return this._makeRequest({
        method: "POST",
        path: "/payments",
        data,
      });
    },
    async listClients(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/clients",
        params: opts,
      });
    },
    async getClient(opts = {}) {
      const { clientId } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/clients/${clientId}`,
      });
    },
    async createClient(data) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        data,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          page,
          ...opts,
        });
        if (response.length === 0) {
          hasMore = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }

      return results;
    },
  },
};
