import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "frameio",
  version: "0.0.{{ts}}",
  propDefinitions: {
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment.",
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
        return data?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team.",
      async options({ accountId }) {
        const data = await this.listTeams(accountId);
        return data?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Select a project or provide a custom ID.",
      async options({ teamId }) {
        const data = await this.listProjects(teamId);
        return data?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "Select an asset or provide a custom ID.",
      useQuery: true,
      async options({
        accountId, teamId, projectId, query,
      }) {
        const data = await this.searchAssets({
          params: {
            account_id: accountId,
            team_id: teamId,
            project_id: projectId,
            query,
          },
        });
        return data?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
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
    async listProjects(teamId) {
      return this._makeRequest({
        url: `/teams/${teamId}/projects`,
      });
    },
    async searchAssets(args) {
      return this._makeRequest({
        url: "/search/assets",
        ...args,
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
