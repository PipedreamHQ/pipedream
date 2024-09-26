import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "businesslogic",
  methods: {
    _baseUrl() {
      return "https://api.businesslogic.online";
    },
    _headers() {
      return {
        "X-Auth-Token": `${this.$auth.live_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    describeEndpoint(args = {}) {
      return this._makeRequest({
        path: "/describe",
        ...args,
      });
    },
    executeEndpoint(args = {}) {
      return this._makeRequest({
        path: "/execute",
        method: "POST",
        ...args,
      });
    },
  },
};
