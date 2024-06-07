import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "identitycheck",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "First Name for the identity check",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last Name for the identity check",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
    },
  },
  methods: {
    _baseUrl() {
      return "https://identity.stackgo.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Basic ${this.$auth.api_key}`,
        },
      });
    },
    async createVerification(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/direct-verification",
        ...args,
      });
    },
  },
};
