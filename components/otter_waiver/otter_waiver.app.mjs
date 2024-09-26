import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "otter_waiver",
  methods: {
    _baseUrl() {
      return "https://api.otterwaiver.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    async createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/subscribe",
        ...opts,
      });
    },
    async deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/unsubscribe",
        ...opts,
      });
    },
    async getLatestCheckIns() {
      return this._makeRequest({
        method: "GET",
        path: "/participants/latest/checkins",
      });
    },
    async getLatestParticipants() {
      return this._makeRequest({
        method: "GET",
        path: "/participants/latest",
      });
    },
  },
};
