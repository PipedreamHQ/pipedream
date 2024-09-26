import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "storyscale",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://prodapi.storyscale.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
      };
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
        headers: this._headers(),
      });
    },
    listTours(opts = {}) {
      return this._makeRequest({
        path: "/tour/show-all",
        ...opts,
      });
    },
  },
};
