import axios from "@pipedream/platform"

export default {
  type: "app",
  app: "yotpo",
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiKey() {
      return this.$auth.app_key;
    },
    _apiUrl() {
      return `https://api.yotpo.com/apps/${this._apiKey()}`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        // headers: {
        //   Authorization: `Bearer ${this._accessToken()}`,
        // },
        params: {
          ...args.params,
          utoken: this._accessToken()
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
      });
    },
    // async getReviews() {

    // }
  },
}
