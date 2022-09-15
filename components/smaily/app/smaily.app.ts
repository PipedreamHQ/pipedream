import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "smaily",
  propDefinitions: {},
  methods: {
    _subdomain() {
      return this.$auth.subdomain;
    },
    _username() {
      return this.$auth.username;
    },
    _password() {
      return this.$auth.password;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.sendsmaily.net/api`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._username(),
          password: this._password(),
        },
        ...args,
      });
    },
    async sendConfirmationEmail(args = {}) {
      return this._makeRequest({
        path: "/autoresponder.php",
        method: "post",
        ...args,
      });
    },
  },
});
