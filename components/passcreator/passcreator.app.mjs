import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "passcreator",
  methods: {
    _baseUrl() {
      return "https://app.passcreator.com/api";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `${this._apiKey()}`,
        },
      });
    },
    createSubscription(args = {}) {
      return this._makeRequest({
        path: "/hook/subscribe",
        method: "POST",
        ...args,
      });
    },
    deleteSubscription(args = {}) {
      return this._makeRequest({
        path: "/hook/unsubscribe",
        method: "DELETE",
        ...args,
      });
    },
  },
};
