import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cutt_ly",
  methods: {
    _baseUrl() {
      return "https://cutt.ly/api";
    },
    _authParams(params) {
      return {
        ...params,
        key: `${this.$auth.api_key}`,
      };
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
        params: this._authParams(params),
      });
    },
    callApi(opts = {}) {
      return this._makeRequest({
        path: "/api.php",
        ...opts,
      });
    },
  },
};
