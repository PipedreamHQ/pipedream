import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "codacy",
  propDefinitions: {
    provider: {
      type: "string",
      label: "Provider",
      description: "The Git provider",
      optional: true,
      options: constants.GIT_PROVIDERS,
    },
    accountProvider: {
      type: "string",
      label: "Account Provider",
      description: "The Account Provider",
      options: constants.ACCOUNT_PROVIDERS,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Maximum number of items to return",
      optional: true,
    },
    remoteOrganizationName: {
      type: "string",
      label: "Organization Name",
      description: "Name of the organization",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.codacy.com/api/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params,
        headers: {
          ...headers,
          "Accept": "application/json",
          "api-token": this.$auth.api_token,
        },
      });
    },
    async getUser(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    async listOrganizations({
      provider, ...args
    }) {
      return this._makeRequest({
        path: `/user/organizations/${provider}`,
        ...args,
      });
    },
    async listIntegrations(args = {}) {
      return this._makeRequest({
        path: "/user/integrations",
        ...args,
      });
    },
    async deleteIntegration({
      accountProvider, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/user/integrations/${accountProvider}`,
        ...args,
      });
    },
  },
};
