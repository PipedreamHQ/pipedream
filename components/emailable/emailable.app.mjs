import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "emailable",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email you want to verify",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A list of emails to verify in batch (up to 50,000)",
    },
    url: {
      type: "string",
      label: "URL",
      description: "A URL that will receive the batch results via HTTP POST",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.emailable.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async verifySingleEmail(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/verify",
      });
    },
    async verifyBatchEmails(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/batch",
      });
    },
    async getAccountInfo() {
      return this._makeRequest({
        path: "/account",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
