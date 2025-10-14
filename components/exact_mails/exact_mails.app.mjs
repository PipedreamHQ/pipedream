import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "exact_mails",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.exactmails.com/api/v1/email";
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    searchPersonEmails(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find-person-email",
        ...opts,
      });
    },
    searchDecisionMakerEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find-decision-maker-email",
        ...opts,
      });
    },
    searchLinkedinEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find-linkedin-email",
        ...opts,
      });
    },
    searchCompanyEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find-company-emails",
        ...opts,
      });
    },
  },
};
