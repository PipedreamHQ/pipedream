import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zerobounce",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address to be validated",
    },
    file: {
      type: "string",
      label: "File",
      description: "The file that contains email addresses to be validated",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.zerobounce.net/v2";
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
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async validateEmail(email) {
      return this._makeRequest({
        path: `/validate?email=${email}`,
      });
    },
    async validateEmailsInFile(file) {
      return this._makeRequest({
        method: "POST",
        path: "/sendfile",
        data: {
          file: file,
        },
      });
    },
    async getReliabilityScore(email) {
      return this._makeRequest({
        path: `/score?email=${email}`,
      });
    },
  },
};
