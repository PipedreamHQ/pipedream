import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nudgify",
  methods: {
    async _makeRequest({
      $, path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `https://app.nudgify.com/api${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createPurchaseNudge(args) {
      return this._makeRequest({
        method: "POST",
        path: "/purchase-nudges",
        ...args,
      });
    },
    async createSignUpNudge(args) {
      return this._makeRequest({
        method: "POST",
        path: "/sign-ups",
        ...args,
      });
    },
  },
};
