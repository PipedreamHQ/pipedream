import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ez_texting_",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.access_token;
    },
    _apiUrl() {
      return "https://a.eztexting.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "Authorization": `Bearer ${this._accessToken()}`,
        },
      });
    },
    async sendTextMessage(args = {}) {
      return this._makeRequest({
        path: "/messages",
        method: "post",
        ...args,
      });
    },
  },
};
