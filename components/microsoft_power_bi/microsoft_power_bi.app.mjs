import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_power_bi",
  propDefinitions: {
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "Select a Dataset or provide a custom Dataset ID.",
      async options() {
        const datasets = await this.getDatasets();
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
    top: {
      type: "integer",
      label: "Top",
      description: "The number of refresh history items to retrieve.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.powerbi.com/v1.0/myorg";
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addRowsToTable({
      datasetId, tableName, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/tables/${tableName}/rows`,
        ...args,
      });
    },
    async refreshDataset({
      datasetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/refreshes`,
        ...args,
      });
    },
    async cancelRefresh({
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
    async emitEvent(eventName, data) {
      this.$emit(data, {
        summary: eventName,
        id: data.id,
      });
    },
  },
};
