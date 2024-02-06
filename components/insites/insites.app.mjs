// Import axios from Pipedream platform
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "insites",
  propDefinitions: {},
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.insites.com/api/v1";
    },
    _getHeaders() {
      return {
        "api-key": `${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async analyzeBusiness(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/report",
        data,
      });
    },
    async searchAllReports(params) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/reports",
        params,
      });
    },
  },
};
