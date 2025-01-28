import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenventory",
  propDefinitions: {
    clientId: {
      type: "integer",
      label: "Client Id",
      description: "Id of the client that the customer order is for.",
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "Name of the client that the customer order is for. **Ignored if clientId is provided and is nonzero.**",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.zenventory.com/rest";
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
    createItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/items",
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
    listItems(opts = {}) {
      return this._makeRequest({
        path: "/items",
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
