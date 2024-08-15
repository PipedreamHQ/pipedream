import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heyzine",
  methods: {
    _baseUrl() {
      return "https://heyzine.com/api1/rest";
    },
    makeRequest(opts = {}) {
      const {
        $ = this,
        params = {},
        ...otherOpts
      } = opts; console.log(params);
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: {
          ...params,
          "k": `${this.$auth.api_key}`,
        },
      });
    },
  },
};
