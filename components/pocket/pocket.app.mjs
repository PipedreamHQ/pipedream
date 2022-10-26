import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pocket",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return await axios($, {
        url: "https://enkogw2a5epb176.m.pipedream.net",
        params: {
          http_respond: 1,
        },
        data: {
          ...args,
          data: {
            ...args.data,
            access_token: this._accessToken(),
          },
        },
      });
    },
    async saveToLater(args = {}) {
      return this._makeRequest({
        url: "/v3/add",
        method: "post",
        ...args,
      });
    },
    async getSavedItems(args = {}) {
      const response = await this._makeRequest({
        url: "/v3/get",
        method: "post",
        ...args,
      });

      return Object.values(response.list);
    },
  },
};
