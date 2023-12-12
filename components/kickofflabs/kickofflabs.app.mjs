import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kickofflabs",
  propDefinitions: {},
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getCampaignId() {
      return this.$auth.campaign_id;
    },
    _getBaseUrl() {
      return "https://api.kickofflabs.com/v2";
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
          api_key: this._getApiKey(),
          ...opts.params,
        },
      };
      return axios(ctx, axiosOpts);
    },
    async createOrUpdateLead(data, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/${this._getCampaignId()}`,
        data,
      }, ctx);
    },
    async getCampaignStatus(ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${this._getCampaignId()}/stats`,
      }, ctx);
    },
    async removeLeadFromCampaign(emails, ctx = this) {
      return this._makeHttpRequest({
        method: "DELETE",
        path: `/${this._getCampaignId()}`,
        params: {
          email: emails,
        },
      }, ctx);
    },
  },
};
