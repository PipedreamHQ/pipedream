import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "msg91",
  methods: {
    _getBaseUrl() {
      return "https://api.msg91.com/api/v5";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "authkey": this.$auth.authkey,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        headers: this._getHeaders(),
        url: `${this._getBaseUrl()}${path}`,
        ...opts,
      });
    },
    sendSMS(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/flow",
        ...args,
      });
    },
    launchCampaign({
      campaignSlug, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaign/api/campaigns/${campaignSlug}/run`,
        ...args,
      });
    },
    createOrUpdateContact({
      phonebook, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/segmento/api/v1/phonebooks/${phonebook}/contacts`,
        ...args,
      });
    },
  },
};
