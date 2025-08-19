import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mboum",
  propDefinitions: {
    ticker: {
      type: "string",
      label: "Ticker",
      description: "Ticker symbol to get data for. (e.g., AAPL, MSFT)",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return",
      optional: true,
      default: 1,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Enter a calendar date. Format: YYYY-MM-DD",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mboum.com/";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    // General API
    search(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/search",
        ...opts,
      });
    },
    getMovers(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/movers",
        ...opts,
      });
    },
    getScreener(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/screener",
        ...opts,
      });
    },
    getInsiderTrading(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/insider-trades",
        ...opts,
      });
    },
    getNews(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/news",
        ...opts,
      });
    },
    getTickers(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/tickers",
        ...opts,
      });
    },
    getMarketInfo(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/market-info",
        ...opts,
      });
    },
    // Stocks API
    getRealtimeQuote(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/quote",
        ...opts,
      });
    },
    getHistory(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/history",
        ...opts,
      });
    },
    getModules(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/stock/modules",
        ...opts,
      });
    },
    getAnalystRatings(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/stock/analyst-ratings",
        ...opts,
      });
    },
    getTickerSummary(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/ticker-summary",
        ...opts,
      });
    },
    getPriceTargets(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/price-targets",
        ...opts,
      });
    },
    getFinancials(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/financials",
        ...opts,
      });
    },
    getRevenue(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/revenue",
        ...opts,
      });
    },
    getShortInterest(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/short-interest",
        ...opts,
      });
    },
    getInstitutionalHoldings(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/institutional-holdings",
        ...opts,
      });
    },
    getSecFilings(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/sec-filings",
        ...opts,
      });
    },
    getHistoricalData(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/stock/historical",
        ...opts,
      });
    },
    // Options API
    getOptions(opts = {}) {
      return this._makeRequest({
        path: "/v3/markets/options",
        ...opts,
      });
    },
    getUnusualOptionsActivity(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/unusual-options-activity",
        ...opts,
      });
    },
    getIvRankPercentile(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/iv-rank-percentile",
        ...opts,
      });
    },
    getIvChange(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/iv-change",
        ...opts,
      });
    },
    getMostActive(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/most-active",
        ...opts,
      });
    },
    getHighestIv(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/highest-iv",
        ...opts,
      });
    },
    getOptionsFlow(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/options/options-flow",
        ...opts,
      });
    },
    // Calendar Events API
    getEarnings(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/calendar/earnings",
        ...opts,
      });
    },
    getDividends(opts = {}) {
      return this._makeRequest({
        path: "/v2/markets/calendar/dividends",
        ...opts,
      });
    },
    getEconomicEvents(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/calendar/economic_events",
        ...opts,
      });
    },
    getIpoData(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/calendar/ipo",
        ...opts,
      });
    },
    getPublicOfferings(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/calendar/public_offerings",
        ...opts,
      });
    },
    getStockSplits(opts = {}) {
      return this._makeRequest({
        path: "/v1/markets/calendar/stock-splits",
        ...opts,
      });
    },
  },
};
