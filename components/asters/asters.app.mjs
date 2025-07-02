import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "asters",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace",
      async options() {
        const { data: { workspaces = [] } } = await this.listWorkspaces();
        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace._id,
        }));
      },
    },
    socialAccountId: {
      type: "string",
      label: "Social Account ID",
      description: "The ID of a social account",
      async options({ workspaceId }) {
        const { data = [] } = await this.listSocialAccounts({
          workspaceId,
        });
        return data.map((account) => ({
          label: account.name,
          value: account.account_id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.asters.ai/api/external/v1.0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listSocialAccounts({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/socialAccounts`,
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/data/posts",
        ...opts,
      });
    },
  },
};
