import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "polygon",
  version: "0.0.{{ts}}",
  propDefinitions: {
    stockTicker: {
      type: "string",
      label: "Stock Ticker",
      description: "The stock ticker symbol, e.g., AAPL, MSFT",
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to filter news articles",
      optional: true,
    },
    newsStockTickers: {
      type: "string[]",
      label: "News Stock Tickers",
      description: "Stock tickers to filter news articles related to specific stocks",
      optional: true,
    },
    timeInterval: {
      type: "string",
      label: "Time Interval",
      description: "Desired time interval for daily price summary",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Start date for historical price data (YYYY-MM-DD)",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "End date for historical price data (YYYY-MM-DD)",
      optional: true,
    },
  },
  methods: {
    // Logs authentication keys for debugging purposes
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Returns the base URL for Polygon API
    _baseUrl() {
      return "https://api.polygon.io";
    },
    // Makes an HTTP request using axios with the provided options
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        params: {
          apiKey: this.$auth.api_key,
          ...(otherOpts.params || {}),
        },
        headers: {
          ...headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
        },
      });
    },
    // Retrieves trade events for the specified stock ticker
    async getTradeEvents() {
      return this._makeRequest({
        path: `/v2/trades/${this.stockTicker}`,
      });
    },
    // Retrieves news articles related to the stock ticker with optional filters
    async getNewsArticles() {
      const params = {
        tickers: this.stockTicker,
        ...(this.keywords && this.keywords.length > 0
          ? {
            keywords: this.keywords.join(","),
          }
          : {}),
        ...(this.newsStockTickers && this.newsStockTickers.length > 0
          ? {
            tickers: this.newsStockTickers.join(","),
          }
          : {}),
      };
      return this._makeRequest({
        path: "/v2/reference/news",
        params,
      });
    },
    // Retrieves the daily price summary for the specified stock ticker
    async getDailyPriceSummary() {
      const today = new Date().toISOString()
        .split("T")[0];
      const path = `/v1/open-close/${this.stockTicker}/${today}`;
      const params = {
        adjusted: true,
        ...(this.timeInterval
          ? {
            interval: this.timeInterval,
          }
          : {}),
      };
      return this._makeRequest({
        path,
        params,
      });
    },
    // Retrieves the current price for the specified stock ticker
    async getCurrentPrice() {
      return this._makeRequest({
        path: `/v2/snapshot/locale/us/markets/stocks/tickers/${this.stockTicker}`,
      });
    },
    // Fetches historical price data for the specified stock ticker within the date range
    async getHistoricalPriceData() {
      if (!this.fromDate || !this.toDate) {
        throw new Error("Both fromDate and toDate must be provided for historical price data.");
      }
      return this._makeRequest({
        path: `/v2/aggs/ticker/${this.stockTicker}/range/1/day/${this.fromDate}/${this.toDate}`,
        params: {
          adjusted: true,
          sort: "asc",
          limit: 120,
        },
      });
    },
    // Retrieves financial details for the specified stock ticker
    async getFinancialDetails() {
      return this._makeRequest({
        path: `/v3/reference/financials/${this.stockTicker}`,
      });
    },
  },
};
