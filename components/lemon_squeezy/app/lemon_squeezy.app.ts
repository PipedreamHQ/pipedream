import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "lemon_squeezy",
  propDefinitions: {
    customerId: {
      type: "integer",
      label: "Customer Id",
      description: "The Id of the customer you want to retrieve",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer you want to retrieve.",
    },
    orderId: {
      type: "integer",
      label: "Order Id",
      description: "The Id of the order you want to retrieve.",
      async options({ page }) {
        const { data } = await this.listOrders({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, attributes: {
            user_name, total_formatted, identifier,
          },
        }) => ({
          label: `${user_name} (${total_formatted}) - ${identifier}`,
          value,
        }));
      },
    },
    productId: {
      type: "integer",
      label: "Product Id",
      description: "The Id of the product you want to retrieve.",
      async options({ page }) {
        const { data } = await this.listProducts({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.lemonsqueezy.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
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
    listCustomers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "customers",
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "orders",
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "products",
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "subscriptions",
      });
    },
    retrieveCustomer({
      $, customerId,
    }) {
      return this._makeRequest({
        $,
        path: `customers/${customerId}`,
      });
    },
    retrieveOrder({
      $, orderId,
    }) {
      return this._makeRequest({
        $,
        path: `orders/${orderId}`,
      });
    },
    retrieveProduct({
      $, productId,
    }) {
      return this._makeRequest({
        $,
        path: `products/${productId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;

      do {
        const {
          data,
          meta: {
            page: {
              current_page,
              last_page,
            },
          },
        } = await fn({
          params,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(current_page == last_page);

      } while (lastPage);
    },
  },
});
