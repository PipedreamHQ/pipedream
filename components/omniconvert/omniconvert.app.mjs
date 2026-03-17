import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "omniconvert",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "http://api.omniconvert.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Api-User": this.$auth.api_user,
          "X-Api-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    listExperiments(opts = {}) {
      return this._makeRequest({
        path: "/experiments",
        ...opts,
      });
    },
  },
};
