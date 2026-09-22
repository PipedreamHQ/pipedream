import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "digistore24",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product to filter by",
      optional: true,
      async options() {
        const { data: { products } } = await this.listProducts();
        return products?.map(({
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
      return "https://www.digistore24.com/api/call";
    },
    _headers() {
      return {
        "X-DS-API-KEY": this.$auth.api_key,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/listProducts",
        ...opts,
      });
    },
    listPurchases(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/listPurchases",
        ...opts,
      });
    },
    listRebillingStatusChanges(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/listRebillingStatusChanges",
        ...opts,
      });
    },
    listTransactions(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/listTransactions",
        ...opts,
      });
    },
  },
};
