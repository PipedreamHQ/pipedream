import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chaser",
  propDefinitions: {
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The details of the customer to create.",
    },
    associatedContactDetails: {
      type: "object",
      label: "Associated Contact Details",
      description: "The contact details associated with the customer.",
      optional: true,
    },
    invoicePdfFile: {
      type: "string",
      label: "Invoice PDF File",
      description: "The PDF file of the invoice to upload.",
    },
    invoiceDetails: {
      type: "object",
      label: "Invoice Details",
      description: "The details of the invoice to create.",
    },
    additionalInvoiceDetails: {
      type: "object",
      label: "Additional Invoice Details",
      description: "Additional details for the invoice, like due date or terms.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.host}/v1`;
    },
    async _makeRequest({
      $ = this,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        auth: {
          username: `${this.$auth.key}`,
          password: `${this.$auth.secret}`,
        },
      });
    },
    async createCustomer({
      customerDetails, associatedContactDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/customers",
        data: {
          ...customerDetails,
          contact_details: associatedContactDetails,
        },
      });
    },
    async uploadInvoicePdf({
      invoicePdfFile, customerDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/invoices/pdf",
        data: {
          invoice_pdf_file: invoicePdfFile,
          ...customerDetails,
        },
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    },
    async createInvoice({
      invoiceDetails, additionalInvoiceDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/invoices",
        data: {
          ...invoiceDetails,
          ...additionalInvoiceDetails,
        },
      });
    },
  },
};
