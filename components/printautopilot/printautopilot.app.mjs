import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "printautopilot",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://printautopilot.com/api";
    },
    _headers(token) {
      return {
        "Authorization": `Bearer ${token || this.$auth.connection_token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        token,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(token),
      });
    },
    addDocumentToQueue(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/document/create",
        ...opts,
      });
    },
  },
};
