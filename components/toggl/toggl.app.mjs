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
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl(apiVersion) {
      return constants.API_BASE_URL_VERSIONS[apiVersion];
    },
    async _makeRequest(apiVersion, path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl(apiVersion)}/${path}`,
        auth: {
          username: this._apiToken(),
          password: "api_token",
        },
        ...options,
      });
    },
    async createWebhook({
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
    async removeWebhook({
      workspaceId, webhookId,
    }) {
      return this._makeRequest("v1", `subscriptions/${workspaceId}/${webhookId}`, {
        method: "delete",
      });
    },
    async getWorkspaces({ $ } = {}) {
      return this._makeRequest("v8", "workspaces", {}, $);
    },
    async getCurrentTimeEntry({ $ } = {}) {
      return this._makeRequest("v8", "time_entries/current", {}, $);
    },
    async getTimeEntries({
      params, $,
    } = {}) {
      return this._makeRequest("v8", "time_entries", {
        params: {
          ...params,
          per_page: 1000,
        },
      }, $);
    },
    async getTimeEntry({
      timeEntryId, $,
    } = {}) {
      const { data } = await this._makeRequest("v8", `time_entries/${timeEntryId}`, {}, $);

      return data;
    },
    async createNewClient({name, workspace_id, $, } = {}) {
      const { data } = await this._makeRequest("v9", `workspaces/${workspace_id}/clients`, {
        method: 'post',
        data: {
          name,
          wid: workspace_id,
        }
      }, $)
      return data;
    },
    async updateClient({name, workspace_id, client_id, $, } = {}) {
      const { data } = await this._makeRequest("v9", `workspaces/${workspace_id}/clients/${client_id}`, {
        method: 'put',
        data: {
          name,
          wid: workspace_id,
        }
      }, $)
      return data;
    },
    async createProject({workspace_id, payload, $, } = {}) {
      const { data } = await this._makeRequest("v9", `workspaces/${workspace_id}/projects`, {
        method: 'post',
        data: payload,
      }, $)
      return data;
    },
    async updateProject({workspace_id, payload, project_id, $, } = {}) {
      const { data } = await this._makeRequest("v9", `workspaces/${workspace_id}/projects/${project_id}`, {
        method: 'put',
        data: payload,
      }, $)
      return data;
    },
  },
};
