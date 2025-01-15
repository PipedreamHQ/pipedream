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
        const { customers } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          source_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    lineItemsSectionsAttributes: {
      type: "string[]",
      label: "Line Items Sections Attributes",
      description: "A list of objects of items sections to be listed on the invoice. **Example: [{\"title\": \"Title\",\"description\": \"description\",\"rank\": 1}]** [See the documentation](https://pennylane.readme.io/reference/customer_invoices-post-1) from further information.",
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "A list of objects of items to be listed on the invoice. **Example: [{\"product\": {\"source_id\": \"0e67fc3c-c632-4feb-ad34-e18ed5fbf66a\",\"unit\": \"20\",\"price\": \"10.00\",\"label\": \"Product label\",\"vat_rate\": \"FR_09\",\"currency\": \"EUR\"},\"quantity\": 2,\"label\": \"Line Item Label\"}]** [See the documentation](https://pennylane.readme.io/reference/customer_invoices-post-1) from further information.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.pennylane.com/api/external/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
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
