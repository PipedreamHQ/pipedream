import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crawlbase",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.crawlbase.com";
    },
    makeRequest({
      $ = this, path = "", params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
  },
};
