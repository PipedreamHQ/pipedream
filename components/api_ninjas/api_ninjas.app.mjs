import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "api_ninjas",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain that will be checked",
    },
    length: {
      type: "string",
      label: "Length",
      description: "Length of the password that will be generated",
    },
    address: {
      type: "string",
      label: "IP",
      description: "IP address to lookup",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.api-ninjas.com/v1";
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
          "X-Api-Key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async checkDomain(args = {}) {
      return this._makeRequest({
        path: "/domain",
        ...args,
      });
    },
    async generatePassword(args = {}) {
      return this._makeRequest({
        path: "/passwordgenerator",
        ...args,
      });
    },
    async ipLookup(args = {}) {
      return this._makeRequest({
        path: "/iplookup",
        ...args,
      });
    },
  },
};
