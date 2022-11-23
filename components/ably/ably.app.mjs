import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ably",
  propDefinitions: {},
  methods: {
    _apiKeyInitial() {
      return this.$auth.api_key_initial;
    },
    _apiKeyRemaining() {
      return this.$auth.api_key_remaining;
    },
    _apiUrl() {
      return "https://rest.ably.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKeyInitial(),
          password: this._apiKeyRemaining(),
        },
        ...args,
      });
    },
    async publishMessage({
      channelName, ...args
    }) {
      return this._makeRequest({
        path: `/channels/${channelName}/messages`,
        method: "post",
        ...args,
      });
    },
  },
};
