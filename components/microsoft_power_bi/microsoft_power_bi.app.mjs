import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_power_bi",
  propDefinitions: {
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "Select a Dataset or provide a custom Dataset ID.",
      async options({ addRowsAPIEnabled }) {
        let datasets = await this.getDatasets();
        if (addRowsAPIEnabled) {
          datasets = datasets.filter(({ addRowsAPIEnabled }) => addRowsAPIEnabled);
        }
        return datasets?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table you're updating.",
      async options({ datasetId }) {
        const datasets = await this.getTables({
          datasetId,
        });
        return datasets?.map?.(({
          description, name,
        }) => ({
          label: `"${name}"${description
            ? `: ${description}`
            : ""}`,
          value: name,
        }));
      },
    },
    rows: {
      type: "string[]",
      label: "Rows",
      description: "An array of data rows to add to the dataset table. Each element should be a JSON object represented using key-value format.",
    },
    customDatasetId: {
      type: "string",
      label: "Custom Dataset ID",
      description: "You may enter a Dataset ID directly. Either Dataset ID or Custom Dataset ID must be entered.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.powerbi.com/v1.0/myorg";
    },
    _groupPrefix(groupId) {
      return groupId
        ? `/groups/${groupId}`
        : "";
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      try {
        return await axios($, {
          ...otherOpts,
          url: this._baseUrl() + path,
          headers: {
            ...headers,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          },
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    async resolveGroupId({
      $, workspaceId, workspaceName,
    }) {
      if (workspaceId) return workspaceId;
      if (!workspaceName) return undefined;
      const groups = await this.listGroups({
        $,
      });
      const match = groups.find(({ name }) => name === workspaceName);
      if (!match) {
        throw new ConfigurationError(`No workspace found with name "${workspaceName}". Use the List Workspaces tool to see accessible workspaces.`);
      }
      return match.id;
    },
    async listGroups({ $ } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: "/groups",
      });
      return response.value;
    },
    async listReports({
      $, groupId,
    } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/reports`,
      });
      return response.value;
    },
    async listDatasets({
      $, groupId,
    } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/datasets`,
      });
      return response.value;
    },
    async listDashboards({
      $, groupId,
    } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/dashboards`,
      });
      return response.value;
    },
    addRowsToTable({
      $, datasetId, tableName, groupId, ...args
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `${this._groupPrefix(groupId)}/datasets/${datasetId}/tables/${tableName}/rows`,
        ...args,
      });
    },
    refreshDataset({
      $, datasetId, groupId, ...args
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `${this._groupPrefix(groupId)}/datasets/${datasetId}/refreshes`,
        ...args,
      });
    },
    async getRefreshHistory({
      $, datasetId, groupId, ...args
    }) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/datasets/${datasetId}/refreshes`,
        ...args,
      });
      return response.value;
    },
    async getTables({
      $, datasetId, groupId, ...args
    }) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/datasets/${datasetId}/tables`,
        ...args,
      });
      return response.value;
    },
    async getDatasets({ $ } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: "/datasets/",
      });
      return response.value;
    },
    createDataset(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/datasets",
        ...args,
      });
    },
    executeQueries({
      $, datasetId, groupId, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `${this._groupPrefix(groupId)}/datasets/${datasetId}/executeQueries`,
        data,
      });
    },
    startReportExport({
      $, reportId, groupId, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `${this._groupPrefix(groupId)}/reports/${reportId}/ExportTo`,
        data,
      });
    },
    getReportExportStatus({
      $, reportId, exportId, groupId,
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `${this._groupPrefix(groupId)}/reports/${reportId}/exports/${exportId}`,
      });
    },
    async getReportExportFile({
      $, reportId, exportId, groupId,
    }) {
      try {
        return await axios($ ?? this, {
          method: "GET",
          url: `${this._baseUrl()}${this._groupPrefix(groupId)}/reports/${reportId}/exports/${exportId}/file`,
          headers: {
            "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          },
          responseType: "arraybuffer",
          returnFullResponse: true,
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
  },
};
