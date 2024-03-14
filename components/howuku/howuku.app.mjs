import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "howuku",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.howuku.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
      });
    },
    listSurveys(opts = {}) {
      return this._makeRequest({
        path: "/survey",
        ...opts,
      });
    },
  },
};
