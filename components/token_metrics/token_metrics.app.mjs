import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "token_metrics",
  propDefinitions: {
    tokenId: {
      type: "string",
      label: "Token ID",
      description: "The ID of the token",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in the format YYYY-MM-DD",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in the format YYYY-MM-DD",
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Limit the number of items in response",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tokenmetrics.com/v2";
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
          ...headers,
          "api_key": this.$auth.api_key,
        },
      });
    },
    async getTokens(args = {}) {
      return this._makeRequest({
        path: "/tokens",
        ...args,
      });
    },
    async getTraderGrades(args = {}) {
      return this._makeRequest({
        path: "/trader-grades",
        ...args,
      });
    },
    async getMarketMetrics(args = {}) {
      return this._makeRequest({
        path: "/market-metrics",
        ...args,
      });
    },
  },
};
