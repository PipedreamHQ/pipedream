import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_lead_ads",
  propDefinitions: {},
  methods: {
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getApiVersion() {
      return "v17.0";
    },
    _getBaseUrl() {
      return `https://graph.facebook.com/${this._getApiVersion()}`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          access_token: this._getAccessToken(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async listLeadsByAdOrFormId(id, params) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${id}/leads`,
        params,
      });
    },
    async getLeadById(id) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${id}`,
      });
    },
  },
};
