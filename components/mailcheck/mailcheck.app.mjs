import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailcheck",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to verify or fetch deliverability data for.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.mailcheck.co/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
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
    async verifyEmail({ email }) {
      return this._makeRequest({
        path: `/verify?email=${encodeURIComponent(email)}`,
      });
    },
    async fetchDeliverabilityData({ email }) {
      return this._makeRequest({
        path: `/deliverability?email=${encodeURIComponent(email)}`,
      });
    },
  },
};
