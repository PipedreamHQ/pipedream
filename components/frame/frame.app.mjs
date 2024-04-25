import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "frame",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Select an account or provide a custom ID.",
      async options() {
        const data = await this.listAccounts();
        return data?.map((account) => ({
          label: account.display_name,
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
      description: "Select an asset (file) or provide a custom ID.",
      useQuery: true,
      async options({
        accountId, page, query,
      }) {
        return this.getAssetOptions({
          account_id: accountId,
          q: query,
          page,
        }, "file");
      },
    },
    parentAssetId: {
      type: "string",
      label: "Parent Asset ID",
      description: "Select a parent asset (folder) or provide a custom ID.",
      useQuery: true,
      async options({
        accountId, page, query,
      }) {
        return this.getAssetOptions({
          account_id: accountId,
          q: query,
          page,
        }, "folder");
      },
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
    async searchAssets(args) {
      return this._makeRequest({
        url: "/search/library",
        ...args,
      });
    },
    async getAssetOptions(params, assetType) {
      let data = await this.searchAssets({
        params,
      });
      if (assetType) data = data?.filter((e) => e.type === assetType);
      return data?.map(({
        name, id,
      }) => ({
        label: name,
        value: id,
      }));
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
    async createProject({
      teamId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/teams/${teamId}/projects`,
        ...args,
      });
    },
    async createAsset({
      assetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/assets/${assetId}/children`,
        ...args,
      });
    },
    async createWebhook({
      teamId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/teams/${teamId}/hooks`,
        ...args,
      });
    },
    async deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        url: `/hooks/${hookId}`,
      });
    },
    async getAsset(id) {
      return this._makeRequest({
        url: `assets/${id}`,
      });
    },
    async getComment(id) {
      return this._makeRequest({
        url: `comments/${id}`,
      });
    },
    async getProject(id) {
      return this._makeRequest({
        url: `projects/${id}`,
      });
    },
  },
};
