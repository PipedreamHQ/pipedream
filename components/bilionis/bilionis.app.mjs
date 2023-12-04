import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bilionis",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://bilionis.com/api";
    },
    _authParams(params) {
      return {
        ...params,
        mail: `${this.$auth.email}`,
        key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    listMessages(args = {}) {
      return this._makeRequest({
        path: "/",
        ...args,
      });
    },
  },
};
