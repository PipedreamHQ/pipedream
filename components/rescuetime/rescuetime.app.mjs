import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rescuetime",
  methods: {
    _baseUrl() {
      return "https://www.rescuetime.com/api/oauth";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async getDailySummaryFeed(args = {}) {
      return this._makeRequest({
        path: "/daily_summary_feed",
        ...args,
      });
    },
  },
};
