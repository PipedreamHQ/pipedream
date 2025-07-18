import { axios } from "@pipedream/platform";
import { parseNextPage } from "./common/utils.mjs";

export default {
  type: "app",
  app: "polygon",
  propDefinitions: {
    stockTicker: {
      type: "string",
      label: "Stock Ticker",
      description: "Specify a case-sensitive ticker symbol. For example, AAPL represents Apple Inc.",
      async options({
        page, prevContext,
      }) {
        const parsedPage = parseNextPage(prevContext.nextPage);

        const {
          results, next_url: next,
        } = await this.listStockTickers({
          params: {
            page,
            cursor: parsedPage,
          },
        });

        return {
          options: results.map(({
            ticker: value, name,
          }) => ({
            label: `${name} (${value})`,
            value,
          })),
          context: {
            nextPage: next,
          },
        };
      },
    },
    adjusted: {
      type: "boolean",
      label: "Adjusted",
      description: "Whether or not the results are adjusted for splits. By default, results are adjusted. Set this to false to get results that are NOT adjusted for splits.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.polygon.io";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getCurrentPrice({
      stockTicker, date, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/open-close/${stockTicker}/${date}`,
        ...opts,
      });
    },
    getHistoricalPriceData({
      stockTicker, multiplier, timespan, from, to, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/aggs/ticker/${stockTicker}/range/${multiplier}/${timespan}/${from}/${to}`,
        ...opts,
      });
    },
    getPreviousClose({
      stockTicker, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/aggs/ticker/${stockTicker}/prev`,
        ...opts,
      });
    },
    listStockTickers(opts = {}) {
      return this._makeRequest({
        path: "/v3/reference/tickers",
        ...opts,
      });
    },
    getFinancialDetails(opts = {}) {
      return this._makeRequest({
        path: "/vX/reference/financials",
        ...opts,
      });
    },
    getNewsArticles(opts = {}) {
      return this._makeRequest({
        path: "/v2/reference/news",
        ...opts,
      });
    },
    getTradeEvents({
      stockTicker, ...opts
    }) {
      return this._makeRequest({
        path: `/v3/trades/${stockTicker}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, parseDataFn, maxResults = null, ...opts
    }) {
      let next;
      let count = 0;

      do {
        params.cursor = next;
        const data = await fn({
          params,
          ...opts,
        });

        const {
          parsedData, nextPage,
        } = parseDataFn(data);

        for (const d of parsedData) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        next = nextPage;

      } while (next);
    },
  },
};
