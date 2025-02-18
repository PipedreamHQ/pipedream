import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clear_books",
  propDefinitions: {
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The identifier of a supplier",
      async options({ page }) {
        const suppliers = await this.listSuppliers({
          params: {
            page: page + 1,
          },
        });
        return suppliers?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    purchaseType: {
      type: "string",
      label: "Purchase Type",
      description: "Type of purchase document",
      options: [
        "bills",
        "creditNotes",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.clearbooks.co.uk/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/accounting/customers",
        ...opts,
      });
    },
    listPurchaseDocuments({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/accounting/purchases/${type}`,
        ...opts,
      });
    },
    listTransactions(opts = {}) {
      return this._makeRequest({
        path: "/accounting/transactions",
        ...opts,
      });
    },
    listSuppliers(opts = {}) {
      return this._makeRequest({
        path: "/accounting/suppliers",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounting/customers",
        ...opts,
      });
    },
    createPurchaseDocument({
      type, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounting/purchases/${type}`,
        ...opts,
      });
    },
    createSupplier(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounting/suppliers",
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: 100,
          page: 1,
        },
      };
      let total, count = 0;
      try {
        do {
          const results = await fn(args);
          for (const item of results) {
            yield item;
            if (max && ++count >= max) {
              return;
            }
          }
          total = results?.length;
          args.params.page++;
        } while (total === args.params.limit);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    },
  },
};
