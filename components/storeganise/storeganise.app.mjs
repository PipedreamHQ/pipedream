import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "storeganise",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
    },
    unitId: {
      type: "string",
      label: "Unit ID",
      description: "The ID of the unit",
    },
    rentalId: {
      type: "string",
      label: "Rental ID",
      description: "The ID of the rental",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    noteContent: {
      type: "string",
      label: "Note Content",
      description: "The content of the note",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the note",
      optional: true,
    },
    paymentAmount: {
      type: "number",
      label: "Payment Amount",
      description: "The amount of the payment",
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment",
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The method of the payment",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://pipedream-dev-trial.storeganise.com/api";
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
    async createInvoice(invoiceId) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}`,
      });
    },
    async markRentalOverdue(unitId, rentalId) {
      return this._makeRequest({
        method: "PUT",
        path: `/units/${unitId}/rentals/${rentalId}/overdue`,
      });
    },
    async createUser(userId) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}`,
      });
    },
    async markInvoicePaid(invoiceId, paymentDate) {
      return this._makeRequest({
        method: "PUT",
        path: `/invoices/${invoiceId}/paid`,
        data: {
          payment_date: paymentDate,
        },
      });
    },
    async addNoteToInvoice(invoiceId, noteContent, timestamp) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/notes`,
        data: {
          content: noteContent,
          timestamp: timestamp,
        },
      });
    },
    async addPaymentToInvoice(invoiceId, paymentAmount, paymentDate, paymentMethod) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/payments`,
        data: {
          amount: paymentAmount,
          date: paymentDate,
          method: paymentMethod,
        },
      });
    },
  },
};
