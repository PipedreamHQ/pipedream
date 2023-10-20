import { axios } from "@pipedream/platform";
import {
  FMTS, ORDERS, PERIODS,
} from "./common/constants.mjs";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "eodhd_apis",
  propDefinitions: {
    exchangeCode: {
      type: "string",
      label: "Exchange Code",
      description: "The code of the exchange you want to retrieve.",
      async options() {
        const data = await this.listExchanges();

        return data.map(({
          Code: value, Name,
        }) => ({
          label: `(${value}) ${Name}`,
          value,
        }));
      },
    },
    fmt: {
      type: "string",
      label: "Format",
      description: "The output format.",
      default: "json",
      options: FMTS,
    },
    from: {
      type: "string",
      label: "From",
      description: "The format is `YYYY-MM-DD`. If you need data from Jan 5, 2017, you should use from = 2017-01-05.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Use `a` for ascending dates (from old to new), `d` for descending dates (from new to old). By default, dates are shown in ascending order.",
      options: ORDERS,
    },
    period: {
      type: "string",
      label: "Period",
      description: "Use `d` for daily, `w` for weekly, `m` for monthly prices. By default, daily prices will be shown.",
      options: PERIODS,
    },
    symbolCode: {
      type: "string",
      label: "Ticker (Exchange Symbols)",
      description: "The symbol you want to retrieve.",
      async options({ exchangeCode }) {
        const data = await this.listTickers(exchangeCode);

        return data.map(({
          Code: value, Name,
        }) => ({
          label: `(${value}) ${Name}`,
          value,
        }));
      },
    },
    to: {
      type: "string",
      label: "To",
      description: "The format is `YYYY-MM-DD`. If you need data to Feb 10, 2017, you should use to = 2017-02-10.",
      optional: true,
    },
  },
  methods: {
    _apiUrl() {
      return "https://eodhistoricaldata.com/api";
    },
    _getAuth(params) {
      return {
        "api_token": this.$auth.api_token,
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: this._getAuth(params),
        ...opts,
      };

      return axios($, clearObj(config));
    },
    listExchanges() {
      return this._makeRequest({
        path: "exchanges-list",
      });
    },
    listTickers(exchangeCode) {
      return this._makeRequest({
        path: `exchange-symbol-list/${exchangeCode}`,
        params: {
          fmt: "json",
        },
      });
    },
    getCompanyFinantials({
      path, ...args
    }) {
      return this._makeRequest({
        path: `fundamentals/${path}`,
        ...args,
      });
    },
    getLiveStockPrice({
      path, ...args
    }) {
      return this._makeRequest({
        path: `real-time/${path}`,
        ...args,
      });
    },
    listFinancialNews(args = {}) {
      return this._makeRequest({
        path: "news",
        ...args,
      });
    },
    retrieveStockPrices({
      path, ...args
    }) {
      return this._makeRequest({
        path: `eod/${path}`,
        ...args,
      });
    },
    searchStockSymbol({
      query, ...args
    }) {
      return this._makeRequest({
        path: `search/${query}`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let count = 0;
      let length = 0;
      let limit = maxResults || 1000;
      let page = 0;

      do {
        const data = await fn({
          params: {
            ...params,
            limit,
            offset: limit * page++,
          },
        });
        for (const d of data) {
          yield d;
          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        length = data.length;

      } while (length);
    },
  },
};
