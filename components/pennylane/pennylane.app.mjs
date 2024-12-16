import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pennylane",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "Existing customer identifier (source_id)",
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
    _baseUrl() {
      return "https://app.pennylane.com/api/external/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
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
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customer_invoices",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    createBillingSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/billing_subscriptions",
        ...opts,
      });
    },
    listBillingSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/billing_subscriptions",
        params: opts.params,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/customer_invoices",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, fieldName, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        const items = data[fieldName];
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
