import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "addressfinder",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description:
        "Used to identify which of your services is calling the API for activity monitoring purposes. [See the documentation](https://addressfinder.com/r/faq/what-is-the-domain-option-used-for/) for more information.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addressfinder.io/api";
    },
    async _makeRequest({
      $ = this, headers, params, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: this.$auth.secret,
        },
        params: {
          ...params,
          format: "json",
          key: this.$auth.key,
        },
        ...args,
      });
    },
    async verifyAustralianAddress(args) {
      return this._makeRequest({
        url: "/au/address/v2/verification",
        ...args,
      });
    },
    async verifyEmailAddress(args) {
      return this._makeRequest({
        url: "/email/v1/verification",
        ...args,
      });
    },
    async verifyNewZealandAddress(args) {
      return this._makeRequest({
        url: "/nz/address/verification",
        ...args,
      });
    },
  },
};
