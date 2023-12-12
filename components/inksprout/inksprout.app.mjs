import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "inksprout",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://inksprout.co/api/v1";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async createSummary(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/summarize",
        data: params,
      }));
      return result;
    },
    async listSummaries(ctx = this, offset) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/summaries",
        params: {
          offset,
        },
      }));
      return result;
    },
  },
};
