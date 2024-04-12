import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "frameio",
  version: "0.0.{{ts}}",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset.",
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The comment message.",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the comment.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Select an account or provide a custom ID.",
      async options() {
        const data = await this.listAccounts();
        return data?.map((account) => ({
          label: account.name,
          value: account.id,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team.",
      async options({ accountId }) {
        const data = await this.listTeams(accountId);
        return data?.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    updateValues: {
      type: "object",
      label: "Update Values",
      description: "The values to update the asset with.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.frame.io/v2";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async listAccounts() {
      return this._makeRequest({
        url: "/accounts",
      });
    },
    async listTeams(accountId) {
      return this._makeRequest({
        url: `/accounts/${accountId}/teams`,
      });
    },
    async sendComment({
      assetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/assets/${assetId}/comments`,
        ...args,
      });
    },
    async createProject(args) {
      return this._makeRequest({
        method: "POST",
        url: "/projects",
        ...args,
      });
    },
    async modifyAsset({
      assetId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/assets/${assetId}`,
        ...args,
      });
    },
  },
};
