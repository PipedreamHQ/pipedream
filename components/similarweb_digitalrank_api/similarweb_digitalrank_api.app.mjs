import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "similarweb_digitalrank_api",
  propDefinitions: {
    similarwebApiKey: {
      type: "string",
      label: "Similarweb API Key",
      description: "Your Similarweb API key",
      secret: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of desired results",
      optional: true,
      default: 10,
      min: 1,
      max: 100,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Enter the domain to retrieve its global rank",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.similarweb.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.similarwebApiKey}`,
        },
        params,
        ...otherOpts,
      });
    },
    async listTopRankingWebsites(opts = {}) {
      const { limit } = opts;
      return this._makeRequest({
        path: "/similar-rank/top-sites/all-traffic",
        params: {
          limit: limit || this.limit,
        },
      });
    },
    async getWebsiteRank(opts = {}) {
      const { domain } = opts;
      return this._makeRequest({
        path: `/similar-rank/${domain}/rank`,
      });
    },
    async getSubscriptionStatus() {
      return this._makeRequest({
        path: "/user-capabilities",
      });
    },
  },
  version: "0.0.{{ts}}",
};
