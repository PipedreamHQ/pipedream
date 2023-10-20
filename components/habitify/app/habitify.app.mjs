import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "habitify",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.habitify.me";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._apiKey(),
        },
        ...args,
      });
    },
    async getHabits(args = {}) {
      return this._makeRequest({
        path: "/habits",
        ...args,
      });
    },
  },
};
