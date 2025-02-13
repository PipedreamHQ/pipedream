import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zep",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.getzep.com/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "authorization": `Api-Key ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
  },
};
