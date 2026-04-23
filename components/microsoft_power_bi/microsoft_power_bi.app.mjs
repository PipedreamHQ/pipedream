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
    refreshId: {
      type: "string",
      label: "Refresh ID",
      description: "Select a refresh operation or provide a custom ID. Refreshes that have already been completed are not listed.",
      async options({ datasetId }) {
        const refreshes = await this.getRefreshHistory({
          datasetId,
        });
        return refreshes?.filter?.(({ status }) => status !== "Completed").map(({
          requestId, startTime, status,
        }) => ({
          label: `${startTime} (${status})`,
          value: requestId,
        }));
      },
    },
    customDatasetId: {
      type: "string",
      label: "Custom Dataset ID",
      description: "You may enter a Dataset ID directly. Either Dataset ID or Custom Dataset ID must be entered.",
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Workspace (Group) ID",
      description: "Optional. Power BI workspace ID from the service URL or admin settings.",
      optional: true,
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "Select a report or provide a custom Report ID.",
      async options({ groupId }) {
        let workspaceId = (groupId == null || groupId === "")
          ? undefined
          : groupId;
        const reports = await this.getReports({
          groupId: workspaceId,
        });
        return reports?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.powerbi.com/v1.0/myorg";
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
    addRowsToTable({
      datasetId, tableName, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/tables/${tableName}/rows`,
        ...args,
      });
    },
    refreshDataset({
      datasetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/refreshes`,
        ...args,
      });
    },
    cancelRefresh({
      datasetId, refreshId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/datasets/${datasetId}/refreshes/${refreshId}`,
        ...args,
      });
    },
    async getRefreshHistory({
      datasetId, ...args
    }) {
      const response = await this._makeRequest({
        method: "GET",
        path: `/datasets/${datasetId}/refreshes`,
        ...args,
      });
      return response.value;
    },
    async getTables({
      datasetId, ...args
    }) {
      const response = await this._makeRequest({
        method: "GET",
        path: `/datasets/${datasetId}/tables`,
        ...args,
      });
      return response.value;
    },
    async getDatasets() {
      const response = await this._makeRequest({
        method: "GET",
        path: "/datasets/",
      });
      return response.value;
    },
    async getReports({
      groupId, ...args
    } = {}) {
      const path = groupId
        ? `/groups/${groupId}/reports`
        : "/reports";
      const response = await this._makeRequest({
        method: "GET",
        path,
        ...args,
      });
      return response.value;
    },
    getReport({
      reportId, groupId, ...args
    }) {
      if (reportId == null || reportId === "") {
        throw new ConfigurationError("Report ID is required.");
      }
      const path = groupId
        ? `/groups/${groupId}/reports/${reportId}`
        : `/reports/${reportId}`;
      return this._makeRequest({
        method: "GET",
        path,
        ...args,
      });
    },
    createDataset(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/datasets",
        ...args,
      });
    },
  },
};
