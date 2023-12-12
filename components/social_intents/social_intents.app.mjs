import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "social_intents",
  propDefinitions: {},
  methods: {
    _accountId() {
      return this.$auth.account_id;
    },
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.socialintents.com/v1/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._accountId(),
          password: this._apiToken(),
        },
        ...args,
      });
    },
    async getChats(args = {}) {
      return this._makeRequest({
        path: "/chats",
        ...args,
      });
    },
  },
};
