import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reward_sciences",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.rewardsciences.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Accept": "application/vnd.rewardsciences.v1+json",
          "Content-Type": "application/json",
          "Version": "HTTP/1.0",
        },
        ...opts,
      });
    },
    trackActivity(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        method: "POST",
        ...opts,
      });
    },
  },
};
