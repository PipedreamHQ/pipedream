import {
  axios, ConfigurationError,
} from "@pipedream/platform";
const API_VERSION = "5.0";

export default {
  type: "app",
  app: "azure_devops",
  propDefinitions: {
    organizationName: {
      type: "string",
      label: "Organization",
      description: "Name of the organization",
      async options() {
        const accounts = await this.listAccounts();
        return accounts?.map((org) => org.accountName);
      },
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Event type to receive events for",
      async options({ organization }) {
        const types = await this.listEventTypes(organization);
        return types?.map((type) => type.id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://dev.azure.com";
    },
    _headers(useOAuth) {
      const token = useOAuth
        ? this._oauthAccessToken()
        : this._personalAccessToken();
      if (!token && !useOAuth) {
        throw new ConfigurationError("Azure DevOps Personal Access Token is required for this operation. Add it to your Azure DevOps connection.");
      }
      const basicAuth = Buffer.from(`${this._oauthUid()}:${token}`).toString("base64");
      return {
        Authorization: `Basic ${basicAuth}`,
      };
    },
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _oauthUid() {
      return this.$auth.oauth_uid;
    },
    _personalAccessToken() {
      return this.$auth.personal_access_token;
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        url,
        path,
        useOAuth = false,
        ...otherArgs
      } = args;
      const config = {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(useOAuth),
        ...otherArgs,
      };
      config.url += config.url.includes("?")
        ? "&"
        : "?";
      config.url += `api-version=${API_VERSION}`;
      try {
        return await axios($, config);
      } catch (error) {
        if (error.response?.status === 401 && !useOAuth) {
          throw new ConfigurationError("Azure DevOps Personal Access Token is required for this operation. Please verify that your personal access token is correct.");
        }
        throw error;
      }
    },
    async listAccounts(args = {}) {
      const { value } = await this._makeRequest({
        url: `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${this._oauthUid()}`,
        useOAuth: true,
        ...args,
      });
      return value;
    },
    async listEventTypes(organization, args = {}) {
      const { value } = await this._makeRequest({
        path: `/${organization}/_apis/hooks/publishers/tfs/eventtypes`,
        ...args,
      });
      return value;
    },
    async createSubscription(organization, args = {}) {
      return  this._makeRequest({
        method: "POST",
        path: `/${organization}/_apis/hooks/subscriptions`,
        ...args,
      });
    },
    async deleteSubscription(organization, subscriptionId, args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/${organization}/_apis/hooks/subscriptions/${subscriptionId}`,
        ...args,
      });
    },
  },
};
