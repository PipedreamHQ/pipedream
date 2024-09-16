import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fakturoid",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Unique identifier for the invoice",
    },
    newStatus: {
      type: "string",
      label: "New Status",
      description: "The new status of the invoice (overdue or paid)",
      options: [
        {
          label: "Overdue",
          value: "overdue",
        },
        {
          label: "Paid",
          value: "paid",
        },
      ],
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier for the customer (optional)",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Identifier for the contact related to the invoice",
    },
    lines: {
      type: "string[]",
      label: "Lines",
      description: "Lines that describe the items in the invoice, as a JSON array",
    },
    number: {
      type: "string",
      label: "Number",
      description: "The invoice number (optional)",
      optional: true,
    },
    due: {
      type: "string",
      label: "Due",
      description: "The due date of the invoice (optional)",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the invoice (optional)",
      optional: true,
    },
    paymentValue: {
      type: "string",
      label: "Payment Value",
      description: "Amount of payment to be executed (optional)",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.fakturoid.cz/api/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "User-Agent": "YourApp (yourname@example.com)",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createInvoice({
      contactId, lines, number, due, note, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${this.$auth.account_slug}/invoices.json`,
        data: {
          subject_id: contactId,
          lines: lines.map(JSON.parse),
          custom_id: number,
          due,
          note,
        },
        ...opts,
      });
    },
    async cancelInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${this.$auth.account_slug}/invoices/${invoiceId}/fire.json`,
        params: {
          event: "cancel",
        },
        ...opts,
      });
    },
    async undoCancelInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${this.$auth.account_slug}/invoices/${invoiceId}/fire.json`,
        params: {
          event: "undo_cancel",
        },
        ...opts,
      });
    },
    async payInvoice({
      invoiceId, paymentValue, ...opts
    }) {
      const data = paymentValue
        ? {
          amount: paymentValue,
        }
        : {};
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${this.$auth.account_slug}/invoices/${invoiceId}/payments.json`,
        data,
        ...opts,
      });
    },
    async removePayment({
      invoiceId, paymentId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/accounts/${this.$auth.account_slug}/invoices/${invoiceId}/payments/${paymentId}.json`,
        ...opts,
      });
    },
    async watchInvoiceStatusChange({
      invoiceId, newStatus,
    }) {
      return {
        event_name: `invoice_${newStatus}`,
        invoice_id: invoiceId,
      };
    },
    async watchContactsAdded() {
      return {
        event_name: "subject_created",
      };
    },
    async watchNewInvoiceCreated({ customerId }) {
      return {
        event_name: "invoice_created",
        customer_id: customerId,
      };
    },
  },
};
