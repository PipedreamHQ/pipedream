import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "softr",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
  },
  methods: {
    _baseUrl() {
      return "https://studio-api.softr.io/v1/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Softr-Api-Key": `${this.$auth.api_key}`,
          "Softr-Domain": `${this.$auth.domain}`,
          "Content-Type": "application/json",
        },
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    deleteUser({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/users/${email}`,
        ...opts,
      });
    },
    generateMagicLink({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/magic-link/generate/${email}`,
        ...opts,
      });
    },
  },
};
