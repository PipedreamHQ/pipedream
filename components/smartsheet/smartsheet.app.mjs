import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartsheet",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log((this.$auth));
    },
    _getBaseUrl() {
      return "https://api.smartsheet.com/2.0";
    },
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getAccessToken()}`,
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
    async createWorkspace(data, ctx = this) {
      const opts = {
        path: "/workspaces",
        method: "POST",
        data,
      };
      return this._makeHttpRequest(opts, ctx);
    },
  },
};
