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
    updateInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/invoices/${invoiceId}`,
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
  },
};
