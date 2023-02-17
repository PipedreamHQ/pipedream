import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "process_street",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://public-api.process.st/api/v1.1";
    },
    _auth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          "X-API-KEY": this._auth(),
        },
      });
    },
  },
};
