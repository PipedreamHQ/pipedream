import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nioleads",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.nioleads.com/v1/openapi";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/new_contacts",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify_email",
        ...opts,
      });
    },
    findEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find_email",
        ...opts,
      });
    },
  },
};
