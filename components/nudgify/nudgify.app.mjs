import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nudgify",
  methods: {
    async _makeRequest({
      $, path, headers, data, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `https://app.nudgify.com/api${path}`,
        headers: {
          ...headers,
          "Accept": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        data: {
          ...data,
          "site_key": `${this.$auth.site_key}`,
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
        path: "/conversions",
        ...args,
      });
    },
  },
};
