import axios from "@pipedream/platform";

export default {
  type: "app",
  app: "wrike",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.wrike.com/api/v4";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    async createTask({
      folder, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folder}/tasks`,
        method: "post",
        ...opts,
      });
    },
  },
};
