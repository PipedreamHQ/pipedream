import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
const LIMIT = constants.LIMIT;

export default {
  type: "app",
  app: "everstox",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order",
      async options({ page }) {
        const { items } = await this.listOrders({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return items?.map(({
          id, order_number: orderNumber,
        }) => ({
          label: `Order Number: ${orderNumber}`,
          value: id,
        })) || [];
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The number of the order",
      async options({ page }) {
        const { items } = await this.listOrders({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return items?.map(({ order_number: orderNumber }) => ({
          label: `Order ${orderNumber}`,
          value: orderNumber.replace(/^#/, ""),
        })) || [];
      },
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of the return",
      async options({ page }) {
        const { items } = await this.listReturns({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
            stategroup: "all",
          },
        });
        return items?.map(({
          id, order_number: orderNumber,
        }) => ({
          label: `Return for Order Number: ${orderNumber}`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}shops/${this.$auth.shop_id}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "everstox-shop-api-token": `${this.$auth.api_token}`,
        },
        ...opts,
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
        path: `/returns/v2/${returnId}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listReturns(opts = {}) {
      return this._makeRequest({
        path: "/returns/v2",
        ...opts,
      });
    },
  },
};
