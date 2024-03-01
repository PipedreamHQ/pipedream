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
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.tokenmetrics.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        params,
        headers: {
          ...headers,
          "api_key": this.$auth.api_key,
        },
      });
    },
    async getTokens(opts = {}) {
      return this._makeRequest({
        path: "/tokens",
        ...opts,
      });
    },
    async getTraderGrades(opts = {}) {
      const {
        tokenId, startDate, endDate, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: `/trader-grades?token_id=${tokenId}&start_date=${startDate}&end_date=${endDate}`,
        ...otherOpts,
      });
    },
    async getMarketMetrics(opts = {}) {
      const {
        startDate, endDate, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: `/market-metrics?start_date=${startDate}&end_date=${endDate}`,
        ...otherOpts,
      });
    },
  },
  version: "0.0.1",
};
