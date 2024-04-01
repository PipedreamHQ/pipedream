import axios from "@pipedream/platform";

export default {
  type: "app",
  app: "paigo",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Customer Account ID",
      description: "The unique identifier for the customer account",
    },
    accountDetails: {
      type: "object",
      label: "Account Details",
      description: "The details for the new customer account",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The unique identifier for the invoice",
    },
    invoiceDetails: {
      type: "object",
      label: "Invoice Details",
      description: "The details for the new invoice",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
    },
    creditAmount: {
      type: "integer",
      label: "Credit Amount",
      description: "The amount of credit to be added to the customer's account",
    },
    offeringDetails: {
      type: "object",
      label: "Offering Details",
      description: "The details for the new offering",
    },
    offeringId: {
      type: "string",
      label: "Offering ID",
      description: "The unique identifier for the offering",
    },
    dimensionDetails: {
      type: "object",
      label: "Dimension Details",
      description: "The details for the new dimension",
    },
    dimensionId: {
      type: "string",
      label: "Dimension ID",
      description: "The unique identifier for the dimension",
    },
    usageAmount: {
      type: "integer",
      label: "Usage Amount",
      description: "The amount of the specific usage type",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paigo.io";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createCustomer(accountDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: accountDetails,
      });
    },
    async createInvoice(invoiceDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: invoiceDetails,
      });
    },
    async incrementCreditBalance(customerId, creditAmount) {
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}/credits`,
        data: {
          amount: creditAmount,
        },
      });
    },
    async createOffering(offeringDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/offerings",
        data: offeringDetails,
      });
    },
    async assignOfferingToCustomer(offeringId, customerDetails) {
      return this._makeRequest({
        method: "POST",
        path: `/offerings/${offeringId}/customers`,
        data: customerDetails,
      });
    },
    async getInvoiceDetails(invoiceId) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}`,
      });
    },
    async createDimension(dimensionDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/dimensions",
        data: dimensionDetails,
      });
    },
    async recordUsage(customerId, dimensionId, usageAmount) {
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}/usage`,
        data: {
          dimensionId,
          amount: usageAmount,
        },
      });
    },
  },
};
