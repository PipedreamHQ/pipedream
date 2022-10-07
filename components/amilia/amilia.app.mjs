import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amilia",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.amilia.com/api/v3/en/org/" + this.$auth.organization;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    async listAccounts({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/accounts",
        ...opts,
      });
    },
  },
};
