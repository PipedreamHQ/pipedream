import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "toggl",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.track.toggl.com/api/v8";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        auth: {
          username: this._apiToken(),
          password: "api_token",
        },
        ...options,
      });
    },
    async getCurrentTimeEntry({ $ } = {}) {
      return this._makeRequest("time_entries/current", {}, $);
    },
  },
};
