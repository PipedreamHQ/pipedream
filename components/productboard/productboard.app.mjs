import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "productboard",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.productboard.com/";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Version": 1,
      };
    },
    async _makeRequest(args) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        ...otherArgs,
      };
      return axios($, config);
    },
    async createHook(data) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        data,
      });
    },
  },
};
