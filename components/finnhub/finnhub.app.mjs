import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "finnhub",
  propDefinitions: {
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Symbol of the company, i.e.: `AAPL`",
    },
    from: {
      type: "string",
      label: "From",
      description: "Initial date to get insider transactions from, i.e.: `2020-03-15`",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Initial date to get insider transactions from, i.e.: `2020-03-15`",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "News category",
      options: constants.NEWS_CATEGORIES,
    },
    exchange: {
      type: "string",
      label: "Exchange",
      description: "Exchange you want to get the list of symbols from",
      options: constants.EXCHANGES,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Filter by currency, i.e.: `USD`",
      optional: true,
    },
    mic: {
      type: "string",
      label: "MIC",
      description: "Filter by MIC code, i.e.: `XNGS`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://finnhub.io/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "X-Finnhub-Token": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },

    async getMarketNews(args = {}) {
      return this._makeRequest({
        path: "/news",
        ...args,
      });
    },
    async getInsiderTransactions(args = {}) {
      return this._makeRequest({
        path: "/stock/insider-transactions",
        ...args,
      });
    },
    async getRecommentadionTrends(args = {}) {
      return this._makeRequest({
        path: "/stock/recommendation",
        ...args,
      });
    },
    async getSymbols(args = {}) {
      return this._makeRequest({
        path: "/stock/symbol",
        ...args,
      });
    },

  },
};
