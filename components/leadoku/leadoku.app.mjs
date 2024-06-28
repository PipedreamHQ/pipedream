import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leadoku",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.growth-x.com/growth/apis";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          analytics_code: `${this.$auth.analytics_code}`,
        },
        ...otherOpts,
      });
    },
    getNewConnections(opts = {}) {
      return this._makeRequest({
        params: {
          method: "new_connections",
        },
        ...opts,
      });
    },
    getNewResponders(opts = {}) {
      return this._makeRequest({
        params: {
          method: "new_responders",
        },
        ...opts,
      });
    },
  },
};
