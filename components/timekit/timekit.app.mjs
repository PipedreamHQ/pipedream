import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timekit",
  propDefinitions: {},
  methods: {
    _auth() {
      return {
        username: "",
        password: this.$auth.api_key,
      };
    },
    _baseUrl() {
      return "https://api.timekit.io/v2";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}` + path,
        auth: this._auth(),
        headers: {
          ...opts.headers,
          "Content-Type": "application/json",
        },
      });
    },
  },
};
