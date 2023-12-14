import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_power_bi",
  propDefinitions: {
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The unique identifier of the dataset you wish to refresh or manipulate.",
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table you're updating.",
      optional: true,
    },
    rows: {
      type: "string[]",
      label: "Rows",
      description: "An array of data rows to add to the dataset table. Each element should be a JSON object represented using key-value format.",
      optional: true,
    },
    refreshId: {
      type: "string",
      label: "Refresh ID",
      description: "The unique identifier of the refresh operation you wish to cancel.",
      optional: true,
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addRowsToTable({
      datasetId, tableName, rows,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/tables/${tableName}/rows`,
        data: {
          rows: rows.map(JSON.parse),
        },
      });
    },
    async refreshDataset({ datasetId }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/refreshes`,
      });
    },
    async cancelRefresh({
      datasetId, refreshId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/datasets/${datasetId}/refreshes/${refreshId}`,
      });
    },
    async getRefreshHistory({
      datasetId, top,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/datasets/${datasetId}/refreshes`,
        params: {
          $top: top,
        },
      });
    },
    async emitEvent(eventName, data) {
      this.$emit(data, {
        summary: eventName,
        id: data.id,
      });
    },
  },
};
