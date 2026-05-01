import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenfulfillment",
  propDefinitions: {
    fulfillmentId: {
      type: "string",
      label: "Fulfillment ID",
      description: "The ID of the fulfillment",
      async options({ page }) {
        const fulfillments = await this.listFulfillments({
          params: {
            page: page + 1,
          },
        });
        return fulfillments?.map(({ id }) => id) || [];
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order",
      async options({ page }) {
        const orders = await this.listOrders({
          params: {
            page: page + 1,
          },
        });
        return orders?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    orderExternalId: {
      type: "string",
      label: "Order External ID",
      description: "Return only fulfillments having matching order externalId",
      async options({ page }) {
        const orders = await this.listOrders({
          params: {
            page: page + 1,
          },
        });
        return orders?.map(({
          externalId: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    orderReturnId: {
      type: "string",
      label: "Order Return ID",
      description: "The ID of the order return.",
      async options({ page }) {
        const returns = await this.listOrderReturns({
          params: {
            page: page + 1,
          },
        });
        return returns?.map((item) => ({
          label: item.orders?.[0]?.name || item.externalId || item.id,
          value: item.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://partner.alaiko.com/api/partner";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getFulfillment({
      fulfillmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/fulfillment/${fulfillmentId}`,
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${orderId}`,
        ...opts,
      });
    },
    listFulfillments(opts = {}) {
      return this._makeRequest({
        path: "/fulfillment",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/order",
        ...opts,
      });
    },
    listOrderReturns(opts = {}) {
      return this._makeRequest({
        path: "/order-return",
        ...opts,
      });
    },
    getOrderReturn({
      orderReturnId, ...opts
    }) {
      return this._makeRequest({
        path: `/order-return/${orderReturnId}`,
        ...opts,
      });
    },
  },
};
