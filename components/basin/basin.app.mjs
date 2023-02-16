import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "basin",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://usebasin.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          api_token: this._apiKey(),
          ...args.params,
        },
      });
    },
    async getSubmissions(args = {}) {
      return this._makeRequest({
        path: "/submissions",
        ...args,
      });
    },
  },
};
