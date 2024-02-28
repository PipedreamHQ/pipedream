import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "altoviz",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice that needs to be sent",
      async options({ page }) {
        const invoices = await this.listInvoices({
          params: {
            PageIndex: page + 1,
            Status: "ToSend",
          },
        });
        return invoices.map(({
          id: value, number,
        }) => ({
          value,
          label: `Invoice #${number}`,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.altoviz.com/v1";
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
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/Webhooks",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/SaleInvoices",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Customers",
        ...opts,
      });
    },
    sendInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/SaleInvoices/Send/${invoiceId}`,
        ...opts,
      });
    },
    findProduct(opts = {}) {
      return this._makeRequest({
        path: "/Products/Find",
        ...opts,
      });
    },
    createProduct(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Products",
        ...opts,
      });
    },
  },
};
