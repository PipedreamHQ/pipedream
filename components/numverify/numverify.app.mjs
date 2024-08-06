import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "numverify",
  methods: {
    async _makeRequest({
      $ = this, params,
    }) {
      return axios($, {
        baseURL: "http://apilayer.net/api",
        params: {
          ...params,
          access_key: `${this.$auth.api_key}`,
        },
      });
    },
    async validateNumber(args) {
      return this._makeRequest({
        url: "/validate",
        ...args,
      });
    },
  },
};
