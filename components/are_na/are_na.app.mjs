import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "are_na",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.are.na/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "user-agent": "@Pipedream/are_na v0.1",
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getAuthenticatedUser(args = {}) {
      return this._makeRequest({
        path: "/me",
        args,
      });
    },
    search({
      query, ...args
    }) {
      return this._makeRequest({
        path: `/search?q=${query}`,
        args,
      });
    },
  },
};
