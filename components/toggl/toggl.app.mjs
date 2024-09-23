import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "toggl",
  propDefinitions: {
    timeEntryId: {
      label: "Time Entry ID",
      description: "The time entry ID",
      type: "integer",
      async options({ page }) {
        const timeEntries = await this.getTimeEntries({
          params: {
            page: page + 1,
          },
        });

        return timeEntries.map((timeEntry) => ({
          label: timeEntry.description ?? `Duration: ${timeEntry.duration}`,
          value: timeEntry.id,
        }));
      },
    },
    workspaceId: {
      label: "Workspace Id",
      description: "The workspace ID",
      type: "integer",
      async options({ page }) {
        const workspaces = await this.getWorkspaces({
          params: {
            page: page + 1,
          },
        });

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    clientId: {
      label: "Client ID",
      description: "The client ID",
      type: "integer",
      async options({ workspaceId }) {
        const clients = await this.getClients({
          workspaceId,
        });

        return clients?.map((client) => ({
          label: client.name,
          value: client.id,
        })) || [];
      },
    },
    projectId: {
      label: "Project ID",
      description: "The project ID",
      type: "integer",
      async options({ workspaceId }) {
        const projects = await this.getProjects({
          workspaceId,
        });

        return projects?.map((project) => ({
          label: project.name,
          value: project.id,
        })) || [];
      },
    },
    clientName: {
      type: "string",
      label: "Name",
      description: "Name of the client",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the client",
      optional: true,
    },
    projectName: {
      type: "string",
      label: "Name",
      description: "Name of the project",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project in `YYYY-MM-DD` format",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the project in `YYYY-MM-DD` format",
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl(apiVersion) {
      return constants.API_BASE_URL_VERSIONS[apiVersion];
    },
    _makeRequest(apiVersion, path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl(apiVersion)}/${path}`,
        auth: {
          username: this._apiToken(),
          password: "api_token",
        },
        ...options,
      });
    },
    createWebhook({
      workspaceId, data,
    }) {
      return this._makeRequest("v1", `subscriptions/${workspaceId}`, {
        method: "post",
        data: {
          ...data,
          enabled: true,
          description: `Pipedream webhook created at ${new Date().toISOString()}`,
        },
      });
    },
    removeWebhook({
      workspaceId, webhookId,
    }) {
      return this._makeRequest("v1", `subscriptions/${workspaceId}/${webhookId}`, {
        method: "delete",
      });
    },
    getWorkspaces({ $ }) {
      return this._makeRequest("v9", "me/workspaces", {}, $);
    },
    getClients({
      workspaceId, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/clients`, {}, $);
    },
    getProjects({
      workspaceId, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/projects`, {}, $);
    },
    getCurrentTimeEntry({ $ } = {}) {
      return this._makeRequest("v9", "me/time_entries/current", {}, $);
    },
    getTimeEntries({
      params, $,
    } = {}) {
      return this._makeRequest("v9", "me/time_entries", {
        params: {
          ...params,
          per_page: 1000,
        },
      }, $);
    },
    getTimeEntry({
      timeEntryId, $,
    } = {}) {
      return this._makeRequest("v9", `me/time_entries/${timeEntryId}`, {}, $);
    },
    getClient({
      workspaceId, clientId, $,
    } = {}) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/clients/${clientId}`, {}, $);
    },
    getProject({
      workspaceId, projectId, $,
    } = {}) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/projects/${projectId}`, {}, $);
    },
    createClient({
      workspaceId, data, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/clients`, {
        method: "post",
        data,
      }, $);
    },
    createProject({
      workspaceId, data, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/projects`, {
        method: "post",
        data,
      }, $);
    },
    updateClient({
      workspaceId, clientId, data, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/clients/${clientId}`, {
        method: "put",
        data,
      }, $);
    },
    updateProject({
      workspaceId, projectId, data, $,
    }) {
      return this._makeRequest("v9", `workspaces/${workspaceId}/projects/${projectId}`, {
        method: "put",
        data,
      }, $);
    },
  },
};
