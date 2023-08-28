import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_analytics",
  propDefinitions: {
    columns: {
      type: "object",
      label: "Columns",
      description: "JSONObject with column name as key and data as value. `Sample:` {\"columnName1\":\"value1\",\"columnName2\":\"value2\"}",
    },
    dateFormat: {
      type: "string",
      label: "Date Format",
      description: "Specify this in-case any date field is being added and its format cannot be auto recognized. `Sample: dd-MMM-YYYY`. Refer this [link](https://analytics.zoho.com/import/ImportHelp.jsp) for more details about how to construct a custom date format.",
    },
    viewId: {
      type: "string",
      label: "View Id",
      description: "The Id of the view.",
      async options({ workspaceId }) {
        const { data: { views } } = await this.listViews(workspaceId);

        return views.filter((view) => view.viewType === "Table").map(({
          viewId: value, viewName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace Id",
      description: "The Id of the workspace.",
      async options() {
        const { data } = await this.listWorkspaces();

        const workspaces = [
          ...data.ownedWorkspaces,
          ...data.sharedWorkspaces,
        ];

        return workspaces.map(({
          workspaceId: value, workspaceName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.base_api_uri}/restapi/v2`;
    },
    _getHeaders() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        "ZANALYTICS-ORGID": this.$auth.organization_id,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addRow({
      workspaceId, viewId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `workspaces/${workspaceId}/views/${viewId}/rows`,
        ...args,
      });
    },
    listViews(workspaceId) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/views`,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "workspaces",
        ...args,
      });
    },
    updateRow({
      workspaceId, viewId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `workspaces/${workspaceId}/views/${viewId}/rows`,
        ...args,
      });
    },
  },
};
