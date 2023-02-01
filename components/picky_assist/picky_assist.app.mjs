import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "picky_assist",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://pickyassist.com/app/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        data: {
          ...args.data,
          token: this._apiToken(),
        },
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/push",
        method: "post",
        ...args,
      });
    },
  },
};
