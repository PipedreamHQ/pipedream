import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onstrategy",
  methods: {
    _baseUrl() {
      return "https://api.onstrategyhq.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    listGoals(opts = {}) {
      return this._makeRequest({
        path: "/goals.json",
        ...opts,
      });
    },
  },
};
