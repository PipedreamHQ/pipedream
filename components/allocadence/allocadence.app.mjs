import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "allocadence",
  methods: {
    _baseUrl() {
      return "https://app.allocadence.com/rest";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: `${this.$auth.api_secret}`,
      };
    },
    _makeRequest({
      $ = this, method = "GET", path, ...opts
    }) {
      return axios($, {
        method,
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    createCustomerOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customer-orders",
        ...opts,
      });
    },
    createPurchaseOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/purchase-orders",
        ...opts,
      });
    },
    listCustomerOrders(opts = {}) {
      return this._makeRequest({
        path: "/customer-orders",
        ...opts,
      });
    },
    listPurchaseOrders(opts = {}) {
      return this._makeRequest({
        path: "/purchase-orders",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, dataField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const response = await fn({
          params,
          ...opts,
        });
        for (const d of response[dataField]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = page < response.meta.totalPages;

      } while (hasMore);
    },
  },
};
