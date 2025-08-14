import { axios } from "@pipedream/platform";
import { handleApiError } from "./common/utils.mjs";

export default {
  type: "app",
  app: "token_metrics",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of items in response",
      optional: true,
      default: 50,
    },
    page: {
      type: "integer", 
      label: "Page",
      description: "Enables pagination and data retrieval control by skipping a specified number of items before fetching data",
      optional: true,
      default: 1,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tokenmetrics.com/v2";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      
      try {
        return await axios($, config);
      } catch (error) {
        handleApiError(error);
      }
    },
    // Generic method for any endpoint
    async makeApiCall({
      $ = this,
      endpoint,
      params = {},
    }) {
      return this._makeRequest({
        $,
        path: endpoint,
        method: "GET",
        params,
      });
    },
    // Specific endpoint methods (can be generated automatically)
    async getTokens({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/tokens",
        params,
      });
    },
    async getTradingSignals({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/trading-signals",
        params,
      });
    },
    async getPrice({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/price",
        params,
      });
    },
    async getHourlyOhlcv({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/hourly-ohlcv",
        params,
      });
    },
    async getDailyOhlcv({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/daily-ohlcv",
        params,
      });
    },
    async getMoonshotTokens({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/moonshot-tokens",
        params,
      });
    },
    async getTmGrades({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/tm-grade",
        params,
      });
    },
    async getTmGradesHistorical({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/tm-grade-history",
        params,
      });
    },
    async getFundamentalGrades({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/fundamental-grade",
        params,
      });
    },
    async getFundamentalGradesHistorical({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/fundamental-grade-history",
        params,
      });
    },
    async getTechnologyGrades({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/technology-grade",
        params,
      });
    },
    async getTechnologyGradesHistorical({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/technology-grade-history",
        params,
      });
    },
    async getMarketMetrics({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/market-metrics",
        params,
      });
    },
    async getAiReports({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/ai-reports",
        params,
      });
    },
    async getCryptoInvestors({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/crypto-investors",
        params,
      });
    },
    async getTopMarketCapTokens({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/top-market-cap-tokens",
        params,
      });
    },
    async getResistanceSupport({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/resistance-support",
        params,
      });
    },
    async getHourlyTradingSignals({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/hourly-trading-signals",
        params,
      });
    },
    async getQuantmetrics({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/quantmetrics",
        params,
      });
    },
  },
};