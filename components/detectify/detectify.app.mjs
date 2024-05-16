import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "detectify",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The target domain for the events",
    },
    userKeys: {
      type: "string",
      label: "User Keys",
      description: "The user keys for authentication",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.detectify.com/rest/v1";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getSevereSecurityFindings({
      domain, userKeys,
    }) {
      return this._makeRequest({
        path: `/findings/severe/${domain}`,
        headers: {
          "User-Keys": userKeys,
        },
      });
    },
    async getModerateSecurityFindings({
      domain, userKeys,
    }) {
      return this._makeRequest({
        path: `/findings/moderate/${domain}`,
        headers: {
          "User-Keys": userKeys,
        },
      });
    },
    async getScanStatus({
      domain, userKeys,
    }) {
      return this._makeRequest({
        path: `/scan/${domain}`,
        headers: {
          "User-Keys": userKeys,
        },
      });
    },
  },
};
