import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ramp",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.ramp.com/developer/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async listTransactions(ctx = this, state, defaultPageSize, latestTransactionId) {
      const params = {
        order_by_date_asc: true,
        page_size: defaultPageSize,
        state,
      };
      if (latestTransactionId) {
        params.start = latestTransactionId;
      }
      return axios(ctx, this._getAxiosParams({
        path: "/transactions",
        method: "GET",
        params,
      }));
    },
  },
};
