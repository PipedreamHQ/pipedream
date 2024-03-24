import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blazemeter",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace to retrieve projects from.",
      async options({ prevContext }) {
        const {
          workspaces, next_page,
        } = await this.listWorkspaces({
          page: prevContext.page || 1,
        });
        return {
          options: workspaces.map((workspace) => ({
            label: workspace.name,
            value: workspace.id.toString(),
          })),
          context: {
            page: next_page,
          },
        };
      },
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account to retrieve workspaces from.",
      async options() {
        const { accountId } = await this.getAccount();
        return [
          {
            label: accountId.toString(),
            value: accountId.toString(),
          },
        ];
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "A description for the project.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://a.blazemeter.com/api/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Basic ${Buffer.from(`${this.$auth.api_key_id}:${this.$auth.api_key_secret}`).toString("base64")}`,
        },
      });
    },
    async listProjects({ workspaceId }) {
      return this._makeRequest({
        path: `/projects?workspaceId=${workspaceId}`,
      });
    },
    async listWorkspaces({ accountId }) {
      return this._makeRequest({
        path: `/workspaces?accountId=${accountId}`,
      });
    },
    async createProject({
      name, description, workspaceId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name,
          description,
          workspaceId,
        },
      });
    },
    async getAccount() {
      // Placeholder method to simulate retrieving account information.
      // Implement the actual logic to retrieve account ID as required.
    },
  },
  version: "0.0.{{ts}}",
};
