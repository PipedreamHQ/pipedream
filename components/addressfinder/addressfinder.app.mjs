import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "addressfinder",
  propDefinitions: {
    address: {
      type: "string",
      label: "Australian Address",
      description: "The Australian address to be verified",
      required: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to be verified",
      required: true,
    },
    nzAddress: {
      type: "string",
      label: "New Zealand Address",
      description: "The New Zealand address to be verified",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addressfinder.io/api";
    },
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: this.$auth.secret,
        },
        ...args,
      });
    },
    async verifyAustralianAddress({ address }) {
      return this._makeRequest({
        path: "/au/address/verification/",
        params: {
          q: address,
          key: this.$auth.api_key,
          format: "json",
        },
      });
    },
    async verifyEmailAddress({ email }) {
      return this._makeRequest({
        path: "/email/verification/",
        params: {
          email: email,
          key: this.$auth.api_key,
          format: "json",
        },
      });
    },
    async verifyNewZealandAddress({ nzAddress }) {
      return this._makeRequest({
        path: "/nz/address/verification/",
        params: {
          q: nzAddress,
          key: this.$auth.api_key,
          format: "json",
        },
      });
    },
  },
};
