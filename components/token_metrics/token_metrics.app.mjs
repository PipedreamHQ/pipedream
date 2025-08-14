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
  },
};