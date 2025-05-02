import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "oanda",
  propDefinitions: {
    isDemo: {
      type: "boolean",
      label: "Is Demo",
      description: "Set to `true` if using a demo/practice account",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The identifier of an account",
      async options({ isDemo }) {
        const { accounts } = await this.listAccounts({
          isDemo,
        });
        return accounts?.map(({ id }) => id) || [];
      },
    },
    tradeId: {
      type: "string",
      label: "Trade ID",
      description: "The ID of the Trade to close when the price threshold is breached",
      async options({
        isDemo, accountId, prevContext,
      }) {
        const {
          trades, lastTransactionID,
        } = await this.listTrades({
          isDemo,
          accountId,
          params: prevContext?.beforeID
            ? {
              beforeID: prevContext.beforeID,
            }
            : {},
        });
        return {
          options: trades?.map(({ id }) => id),
          context: {
            beforeID: lastTransactionID,
          },
        };
      },
    },
    instrument: {
      type: "string",
      label: "Instrument Name",
      description: "The instrument to filter the requested Trades by. E.g. `AUD_USD`",
    },
  },
  methods: {
    _baseUrl(isDemo = false) {
      return isDemo
        ? "https://api-fxpractice.oanda.com/v3"
        : "https://api-fxtrade.oanda.com/v3";
    },
    _makeRequest({
      $ = this,
      path,
      isDemo,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl(isDemo)}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.personal_token}`,
        },
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listTrades({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/trades`,
        ...opts,
      });
    },
    listOpenTrades({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/openTrades`,
        ...opts,
      });
    },
    listOpenPositions({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/openPositions`,
        ...opts,
      });
    },
    listTransactions({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/transactions/idrange`,
        ...opts,
      });
    },
    getHistoricalPrices({
      accountId, instrument, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/instruments/${instrument}/candles`,
        ...opts,
      });
    },
    createOrder({
      accountId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${accountId}/orders`,
        ...opts,
      });
    },
  },
};
