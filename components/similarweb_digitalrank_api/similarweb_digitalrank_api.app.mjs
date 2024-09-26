import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "similarweb_digitalrank_api",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of desired results",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Enter the domain to retrieve its global rank, i.e. `google.com`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.similarweb.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        url: this._baseUrl() + path,
        params: {
          ...params,
          api_key: `${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    async listTopRankingWebsites(args = {}) {
      return this._makeRequest({
        path: "/v1/similar-rank/top-sites/",
        ...args,
      });
    },
    async getWebsiteRank({
      domain, ...args
    }) {
      return this._makeRequest({
        path: `/v1/similar-rank/${domain}/rank`,
        ...args,
      });
    },
    async getSubscriptionStatus(args = {}) {
      return this._makeRequest({
        path: "/user-capabilities",
        ...args,
      });
    },
  },
};
