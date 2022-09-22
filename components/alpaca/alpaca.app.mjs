import { axios } from "@pipedream/platform";
//Did not use Alpaca JS SDK because it does not work with OAuth
export default {
  type: "app",
  app: "alpaca",
  propDefinitions: {
    isPaperAPI: {
      type: "boolean",
      label: "Paper API",
      description: "Set to `true` if Paper API is used. Default is `false`.",
      optional: true,
    },
    cancelOrders: {
      type: "boolean",
      label: "Cancel Orders",
      description: "If `true` is specified, cancel all open orders before liquidating all positions.",
      optional: true,
    },
    side: {
      type: "string",
      label: "Side",
      description: "`buy` or `sell`",
      options: [
        "buy",
        "sell",
      ],
    },
    orderId: {
      type: "string",
      label: "Order Id",
      description: "Order Id",
      async options({
        prevContext,
        isPaperAPI,
      }) {
        const pageSize = 25;
        const after = prevContext.nextAfter;
        const orders = await this.getOrders({
          isPaperAPI,
          params: {
            limit: pageSize,
            after,
            direction: "asc",
          },
        });
        if (!orders.length) {
          return [];
        }
        const nextAfter = orders[orders.length - 1]?.updated_at;
        return {
          options: orders.map((order) => ({
            label: `${order.symbol} ${order.type} ${order.side} - ${order.qty ?? order.notional}`,
            value: order.id,
          })),
          context: {
            nextAfter,
          },
        };
      },
    },
    positionSymbol: {
      type: "string",
      label: "Position Id",
      description: "Position Id",
      async options({ isPaperAPI }) {
        const positions = await this.getPositions({
          isPaperAPI,
        });
        return positions.map((position) => ({
          label: `${position.symbol} ${position.side} - ${position.qty}`,
          value: position.symbol,
        }));
      },
    },
  },
  methods: {
    _getUrl(path, isPaperAPI) {
      // eslint-disable-next-line multiline-ternary
      return `https://${isPaperAPI ? "paper-" : ""}api.alpaca.markets/v2${path}`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this._accessToken()}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, isPaperAPI = false, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path, isPaperAPI),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    async getOrders({ ...args } = {}) {
      return this._makeRequest({
        path: "/orders",
        ...args,
      });
    },
    async getPositions({ ...args } = {}) {
      return this._makeRequest({
        path: "/positions",
        ...args,
      });
    },
    async cancelOrder({
      orderId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/orders/${orderId}`,
        ...args,
      });
    },
    async cancelAllOrders({ ...args } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/orders",
        ...args,
      });
    },
    async closePosition({
      symbol, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/positions/${symbol}`,
        ...args,
      });
    },
    async closeAllPositions({ ...args } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/positions",
        ...args,
      });
    },
    async getAccountInfo({ ...args } = {}) {
      return this._makeRequest({
        path: "/account",
        ...args,
      });
    },
    async placeOrder({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...args,
      });
    },
  },
};
