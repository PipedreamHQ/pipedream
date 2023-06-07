import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "trakt",
  propDefinitions: {},
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _oauthClientId() {
      return this.$auth.oauth_client_id;
    },
    _apiUrl() {
      return "https://api.trakt.tv";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._oauthAccessToken()}`,
          "trakt-api-key": this._oauthClientId(),
        },
        ...args,
      });
    },
    async addToWatchlist(args = {}) {
      return this._makeRequest({
        path: "/sync/watchlist",
        method: "post",
        ...args,
      });
    },
    async removeFromWatchlist(args = {}) {
      return this._makeRequest({
        path: "/sync/watchlist/remove",
        method: "post",
        ...args,
      });
    },
    async getUserWatched({
      userId, type, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId ?? "me"}/watched/${type}`,
        ...args,
      });
    },
    async getUserRating({
      userId, type, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId ?? "me"}/ratings/${type}`,
        ...args,
      });
    },
  },
};
