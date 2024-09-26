import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clearout",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.clearout.io/v2";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "Authorization": `Bearer ${this._apiToken()}`,
        },
      });
    },
    getDomainMx(args = {}) {
      return this._makeRequest({
        path: "/domain/resolve/mx",
        method: "post",
        ...args,
      });
    },
    verifyEmail(args = {}) {
      return this._makeRequest({
        path: "/email_verify/instant",
        method: "post",
        ...args,
      });
    },
    verifyBusinessEmail(args = {}) {
      return this._makeRequest({
        path: "/email/verify/business",
        method: "post",
        ...args,
      });
    },
  },
};
