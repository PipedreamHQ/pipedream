import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "monta",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order",
      async options({ page }) {
        const orders = await this.listOrders({
          params: {
            page,
          },
        });
        return orders.map(({ Id: id }) => ({
          label: `Order ID: ${id}`,
          value: id,
        }));
      },
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of a return",
      async options({ orderId }) {
        const { Returns: returns } = await this.listReturns({
          orderId,
        });
        return returns.map(({ Id: id }) => ({
          label: `Return ID: ${id}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-v6.monta.nl";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    getReturn({
      returnId, ...opts
    }) {
      return this._makeRequest({
        path: `/returns/${returnId}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listReturns({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderId}/return`,
        ...opts,
      });
    },
    listOrderEvents({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderId}/events`,
        ...opts,
      });
    },
  },
};
