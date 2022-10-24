import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
export default defineApp({
  type: "app",
  app: "neverbounce",
  methods: {
    _baseUrl() {
      return "https://api.neverbounce.com/v4";
    },
    async _httpRequest({
      $ = this, endpoint, params,
    }) {
      return axios($, {
        url: this._baseUrl() + endpoint,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
      });
    },
    async verifyEmailAddress(args) {
      const response = await this._httpRequest({
        endpoint: "/single/check",
        ...args,
      });
      const { status } = response;
      if (status !== "success")
        throw new Error(`NeverBounce response status: ${status}`);
      return response;
    },
  },
});
