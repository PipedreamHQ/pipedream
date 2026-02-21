import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ascora",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "If provided, the customer will be updated. If not provided, a new customer will be created.",
      optional: true,
      async options({ page }) {
        const { results } = await this.searchCustomers({
          params: {
            Page: page + 1,
          },
        });
        return results?.map(({
          customerId: value, customerName: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ascora.com.au";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Auth: this.$auth.api_key,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Webhooks/Delete/${webhookId}`,
        ...opts,
      });
    },
    searchCustomers(opts = {}) {
      return this._makeRequest({
        path: "/Customers/Customers",
        ...opts,
      });
    },
    createUpdateCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Customers/Customer",
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Jobs/Job",
        ...opts,
      });
    },
  },
};
