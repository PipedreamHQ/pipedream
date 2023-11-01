import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "push_by_techulus",
  methods: {
    _baseUrl() {
      return "https://push.techulus.com/api/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
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
    sendNotification(args = {}) {
      return this._makeRequest({
        path: "/notify",
        method: "POST",
        ...args,
      });
    },
  },
};
