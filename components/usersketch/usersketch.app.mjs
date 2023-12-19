import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "usersketch",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.usersketch.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "x-api-key": this._apiKey(),
        },
        ...args,
      });
    },
    async createEvent({ ...args } = {}) {
      return this._makeRequest({
        path: "/customer/event/create",
        method: "post",
        ...args,
      });
    },
    async createUser({ ...args } = {}) {
      return this._makeRequest({
        path: "/customer/create",
        method: "post",
        ...args,
      });
    },
  },
};
