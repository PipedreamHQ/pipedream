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
  },
};
