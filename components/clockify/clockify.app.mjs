import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clockify",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Identifier of a workspace",
      async options() {
        const workspaces = await this.listWorkspaces();
        return workspaces?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({
        workspaceId, page,
      }) {
        const projects = await this.listProjects({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return projects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    clientId: {
      type: "string",
      label: "Client",
      description: "Identifier of a client",
      optional: true,
      async options({
        workspaceId, page,
      }) {
        const clients = await this.listClients({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return clients?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    memberIds: {
      type: "string[]",
      label: "Members",
      description: "Array of member/user identifiers",
      async options({
        workspaceId, page,
      }) {
        const members = await this.listMembers({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return members?.map(({
          id: value, name, email,
        }) => ({
          value,
          label: name || email,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.clockify.me/api/v1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _headers() {
      return {
        "X-Api-Key": `${this._apiKey()}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    listProjects({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects`,
        ...args,
      });
    },
    listClients({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/clients`,
        ...args,
      });
    },
    listMembers({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/users`,
        ...args,
      });
    },
    createProject({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects`,
        method: "POST",
        ...args,
      });
    },
    updateMemberships({
      workspaceId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
        method: "PATCH",
        ...args,
      });
    },
    createTask({
      workspaceId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        method: "POST",
        ...args,
      });
    },
  },
};
