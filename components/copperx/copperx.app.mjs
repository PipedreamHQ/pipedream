import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "copperx",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "The id of the customer the invoice is for.",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.environment}/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "customers",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhook-endpoints",
        ...args,
      });
    },
    createInvoice(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "invoices",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhook-endpoints/${hookId}`,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "customers",
        ...args,
      });
    },
  },
};
