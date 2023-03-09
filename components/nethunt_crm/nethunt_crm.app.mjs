import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nethunt_crm",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://nethunt.com/api/v1";
    },
    _auth() {
      return {
        username: this.$auth.email_address,
        password: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        auth: this._auth(),
      });
    },
  },
};
