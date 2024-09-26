import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paigo",
  propDefinitions: {
    offeringId: {
      type: "string",
      label: "Offering ID",
      description: "The unique identifier for the offering",
      async options() {
        const { data } = await this.listOfferings();
        return data?.map(({
          offeringId: value, offeringName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
      async options() {
        const { data } = await this.listCustomers();
        return data?.map(({
          customerId: value, customerName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The unique identifier for the invoice",
      async options({ customerId }) {
        if (!customerId) {
          return [];
        }
        const { data } = await this.getCustomer({
          customerId,
        });
        if (!data?.length) {
          return [];
        }
        const { invoices } = data[0];
        return invoices?.map(({
          invoiceId: value, invoiceDate, currency, amountPaid,
        }) => ({
          value,
          label: `${invoiceDate} - ${amountPaid} ${currency}`,
        })) || [];
      },
    },
    dimensionId: {
      type: "string",
      label: "Dimension ID",
      description: "The unique identifier for the dimension",
      async options() {
        const { data } = await this.listDimensions();
        return data?.map(({
          dimensionId: value, dimensionName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.prod.paigo.tech";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscribe",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}`,
        ...opts,
      });
    },
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    listOfferings(opts = {}) {
      return this._makeRequest({
        path: "/offerings",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listDimensions(opts = {}) {
      return this._makeRequest({
        path: "/dimensions",
        ...opts,
      });
    },
    recordUsage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/usage",
        ...opts,
      });
    },
    createDimension(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dimensions",
        ...opts,
      });
    },
    incrementCreditBalance({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}/transactions`,
        ...opts,
      });
    },
    createOffering(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/offerings",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
  },
};
