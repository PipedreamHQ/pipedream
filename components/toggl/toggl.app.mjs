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
      label: "Workspace ID",
      description: "The Toggl Track workspace ID, e.g. `1234567`. Use **List Workspace ID Options** to find accessible workspace IDs.",
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
      description: "The start date in `YYYY-MM-DD` format, e.g. `2026-09-01`.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date in `YYYY-MM-DD` format, e.g. `2026-09-30`.",
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
    /**
     * Search detailed time entries in a workspace using the Reports API v3.
     *
     * @param {Object} opts - The request options
     * @param {number} opts.workspaceId - The Toggl Track workspace ID
     * @param {Object} opts.data - The detailed report search parameters
     * @param {Object} opts.$ - The Pipedream execution context
     * @returns {Promise<Object>} The full API response, including data and headers
     */
    searchDetailedTimeEntries({
      workspaceId, data, $,
    }) {
      return this._makeRequest(
        "reportsV3",
        `workspace/${workspaceId}/search/time_entries`,
        {
          method: "post",
          data,
          headers: {
            "Content-Type": "application/json",
          },
          returnFullResponse: true,
        },
        $,
      );
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
