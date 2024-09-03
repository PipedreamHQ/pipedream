import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "storeganise",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
      async options({ page }) {
        const invoices = await this.listInvoices({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return invoices?.map(({ id }) => id);
      },
    },
    note: {
      type: "string",
      label: "Note",
      description: "The content of the note",
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment in ISO-8601 format (e.g., `2018-02-18T02:30:00-07:00`)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.storeganise.com/api/v1/admin`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `ApiKey ${this.$auth.api_key}`,
        },
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listUnitRentals(opts = {}) {
      return this._makeRequest({
        path: "/unit-rentals",
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `invoices/${invoiceId}`,
        ...opts,
      });
    },
    updateInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/invoices/${invoiceId}`,
        ...opts,
      });
    },
    updateInvoicePayment({
      invoiceId, itemId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/invoices/${invoiceId}/payments/${itemId}`,
        ...opts,
      });
    },
    addPaymentToInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/payments`,
        ...opts,
      });
    },
  },
};
