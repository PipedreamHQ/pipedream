import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "youcanbook_me",
  propDefinitions: {},
  methods: {
    _accountId() {
      return this.$auth.account_id;
    },
    _username() {
      return this.$auth.username;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://api.youcanbook.me/v1/${this._accountId()}`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: `${this._username()}`,
          password: `${this._apiKey()}`,
        },
        ...args,
      });
    },
    async getBookings({ ...args }) {
      return this._makeRequest({
        path: "/bookings",
        ...args,
      });
    },
  },
};
