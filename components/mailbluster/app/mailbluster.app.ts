import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "mailbluster",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Id",
      description: "Unique ID of the product",
      async options({ page }) {
        const { products } = await this.listProducts({
          params: {
            pageNo: page + 1,
          },
        });

        return products.map(({
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
      return "https://api.mailbluster.com/api";
    },
    _getHeaders() {
      return {
        "Authorization": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createLead(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "leads",
      });
    },
    createProduct(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "products",
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "orders",
      });
    },
    getLead({
      $, leadHash,
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `leads/${leadHash}`,
      });
    },
    getProduct({
      $, productId,
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `products/${productId}`,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "orders",
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "products",
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, field,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        const response = await fn({
          params: {
            ...params,
            pageNo: ++page,
          },
        });
        const {
          meta: {
            pageNo, totalPage,
          },
        } = response;
        const items = response[field];

        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = (pageNo == totalPage);

      } while (!lastPage);
    },
  },
});
