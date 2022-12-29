import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api.servicem8.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    getJob(jobId) {
      return this._makeRequest({
        path: `api_1.0/job/${jobId}.json`,
      });
    },
    setHook({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "PUT",
        params,
      });
    },
    removeHook({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "DELETE",
        data,
      });
    },
  },
};
