import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reform",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.reformhq.com/v1/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitNewResponseEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/job/extract",
      });
    },
  },
};
