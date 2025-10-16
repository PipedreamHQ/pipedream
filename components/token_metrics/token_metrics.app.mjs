import { axios } from "@pipedream/platform";

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
    tokenId: {
      type: "string[]",
      label: "Token IDs",
      description: "Select one or more Token IDs to filter results. Example: `3375,3306`",
      optional: true,
    },
    symbol: {
      type: "string[]",
      label: "Token Symbols",
      description: "Select one or more token symbols to filter results. Example: `BTC,ETH`",
      optional: true,
    },
    tokenName: {
      type: "string[]",
      label: "Token Names",
      description: "Select one or more crypto asset names to filter results. Example: `Bitcoin,Ethereum`",
      optional: true,
    },
    category: {
      type: "string[]",
      label: "Categories",
      description: "Select one or more categories to filter results. Example: `defi,layer-1`",
      optional: true,
    },
    exchange: {
      type: "string[]",
      label: "Exchanges",
      description: "Select one or more exchanges to filter results. Example: `binance,gate`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in `YYYY-MM-DD` format. Example: `2023-10-01`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in `YYYY-MM-DD` format. Example: `2023-10-10`",
      optional: true,
    },
    marketCap: {
      type: "string",
      label: "Minimum Market Cap",
      description: "Minimum market cap in USD. Example: `100000000`",
      optional: true,
    },
    volume: {
      type: "string",
      label: "Minimum Volume",
      description: "Minimum 24h trading volume in USD. Example: `100000000`",
      optional: true,
    },
    fdv: {
      type: "string",
      label: "Minimum FDV",
      description: "Minimum fully diluted valuation in USD. Example: `100000000`",
      optional: true,
    },
    signal: {
      type: "string",
      label: "Signal Type",
      description: "Filter by trading signal type",
      optional: true,
      options: [
        {
          label: "Bullish (1)",
          value: "1",
        },
        {
          label: "No Signal (0)",
          value: "0",
        },
        {
          label: "Bearish (-1)",
          value: "-1",
        },
      ],
    },
    blockchainAddress: {
      type: "string[]",
      label: "Blockchain Addresses",
      description: "Select one or more blockchain addresses to filter results. Example: `binance-smart-chain:0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3`",
      optional: true,
    },
    slug: {
      type: "string[]",
      label: "Token Slugs",
      description: "Comma separated token slugs. Example: `bitcoin,ethereum`",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Expand exchange_list or category_list to return full object. Multiple values will be sent as comma-separated list.",
      optional: true,
      options: [
        {
          label: "Exchange List",
          value: "exchange_list",
        },
        {
          label: "Category List",
          value: "category_list",
        },
      ],
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Number of top cryptocurrencies to retrieve based on market capitalization. Example: `100`",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter by type",
      optional: true,
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Past",
          value: "past",
        },
      ],
      default: "active",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort results by. Supported values: moonshot_at, roi_pct, tm_grade, market_cap_usd",
      optional: true,
      options: [
        {
          label: "Moonshot At",
          value: "moonshot_at",
        },
        {
          label: "ROI Percentage",
          value: "roi_pct",
        },
        {
          label: "TM Grade",
          value: "tm_grade",
        },
        {
          label: "Market Cap USD",
          value: "market_cap_usd",
        },
      ],
    },
    indicesType: {
      type: "string",
      label: "Indices Type",
      description: "Filter indices by type: 'active' for actively managed, 'passive' for passively managed",
      optional: true,
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Passive",
          value: "passive",
        },
      ],
    },
    id: {
      type: "integer",
      label: "ID",
      description: "ID of the index. Example: `1`",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tokenmetrics.com/v3";
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

      return await axios($, config);
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
    async getPricePrediction({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/price-prediction",
        params,
      });
    },
    async getCorrelation({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/correlation",
        params,
      });
    },
    async getIndices({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/indices",
        params,
      });
    },
    async getIndicesHoldings({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/indices-holdings",
        params,
      });
    },
    async getIndicesPerformance({
      $ = this,
      params = {},
    }) {
      return this.makeApiCall({
        $,
        endpoint: "/indices-performance",
        params,
      });
    },
  },
};
