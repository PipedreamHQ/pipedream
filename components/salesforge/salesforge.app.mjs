import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salesforge",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Select a workspace or provide a workspace ID",
      async options({ page }) {
        const response = await this.listWorkspaces({
          params: {
            offset: page,
          },
        });
        return response.data?.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.salesforge.ai/public/v2";
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async createWebhook({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/integrations/webhooks`,
        method: "POST",
        ...args,
      });
    },
    async deleteWebhook({
      workspaceId, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/integrations/webhooks/${webhookId}`,
        method: "DELETE",
        ...args,
      });
    },
    async createContact({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/contacts`,
        method: "POST",
        ...args,
      });
    },
  },
};
