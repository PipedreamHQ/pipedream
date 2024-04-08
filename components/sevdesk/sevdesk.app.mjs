import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sevdesk",
  propDefinitions: {
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact that has been created",
    },
    orderDetails: {
      type: "object",
      label: "Order Details",
      description: "Details of the order that has been created",
    },
    voucherDetails: {
      type: "object",
      label: "Voucher Details",
      description: "Details of the voucher that has been created",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact for the invoice",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order for the invoice",
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "The date of the invoice",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the invoice",
      optional: true,
    },
    discountAmount: {
      type: "number",
      label: "Discount Amount",
      description: "The discount amount for the invoice",
      optional: true,
    },
    invoiceItems: {
      type: "string[]",
      label: "Invoice Items",
      description: "Items to be included in the invoice",
      optional: true,
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice to cancel or send via email",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to send the invoice to",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A custom message for the invoice email",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.sevdesk.de";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    async createInvoice({
      contactId, orderId, invoiceDate, dueDate, discountAmount, invoiceItems,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/Invoice",
        data: {
          contactId,
          orderId,
          invoiceDate,
          dueDate,
          discountAmount,
          invoiceItems,
          mapAll: true,
          objectName: "Invoice",
        },
      });
    },
    async cancelInvoice({ invoiceId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Invoice/${invoiceId}`,
      });
    },
    async sendInvoice({
      invoiceId, emailAddress, customMessage,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Invoice/${invoiceId}/sendViaEmail`,
        data: {
          toEmail: emailAddress,
          subject: "Invoice",
          text: customMessage || "Please find the attached invoice.",
        },
      });
    },
  },
};
