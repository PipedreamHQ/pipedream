import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ringba",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.ringba.com/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listCampaigns({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/campaigns`,
        ...args,
      });
    },
  },
};
