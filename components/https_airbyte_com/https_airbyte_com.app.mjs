import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "https_airbyte_com",
  propDefinitions: {
    name: {
      type: "string",
      label: "Workspace Name",
      description: "Name of the workspace",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "ID of the workspace",
      async options({ page }) {
        const limit = 20;
        const params = {
          limit,
          offset: page * limit,
        };
        const { data } = await this.listWorkspaces({
          params,
        });

        return data.map(({
          workspaceId, name,
        }) => ({
          label: name,
          value: workspaceId,
        }));
      },
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Include deleted workspaces in the list",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airbyte.com/v1";
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
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async createWorkspace(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/workspaces",
        ...args,
      });
    },
    async deleteWorkspace({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/workspaces/${workspaceId}`,
        ...args,
      });
    },
    async updateWorkspace({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/workspaces/${workspaceId}`,
        ...args,
      });
    },
  },
};
