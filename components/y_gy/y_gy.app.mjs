import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "y_gy",
  propDefinitions: {
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "The short link will redirect to this destination URL",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "This is the root domain of the short link. You can add a custom link, but this has to be verified via the y.gy dashboard first.",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The end of the domain. If the suffix is 123, the short link might look like 'y.gy/123'",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "A password to protect you page",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.y.gy/api/v1";
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
          "api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async createShortLink(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/link",
        ...args,
      });
    },
    async getLinks(args = {}) {
      return this._makeRequest({
        path: "/link",
        ...args,
      });
    },
  },
};
