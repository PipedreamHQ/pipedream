import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "appsheet",
  version: "0.0.{{ts}}",
  propDefinitions: {
    appsheetRegion: {
      type: "string",
      label: "AppSheet Region",
      description: "Domain used to invoke the API based on data residency regions",
      options: [
        {
          label: "Global (www.appsheet.com)",
          value: "www.appsheet.com",
        },
        {
          label: "EU (eu.appsheet.com)",
          value: "eu.appsheet.com",
        },
      ],
    },
    appId: {
      type: "string",
      label: "App ID",
      description: "ID of the AppSheet app",
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "Name of the table",
    },
    applicationAccessKey: {
      type: "string",
      label: "Application Access Key",
      description: "Access key for the AppSheet API",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.appsheetRegion}/api/v2/apps/${this.appId}/tables/${encodeURIComponent(this.tableName)}/Action`;
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "POST", data, headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}?applicationAccessKey=${this.applicationAccessKey}`,
        data,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async addRow(rowData) {
      const requestBody = {
        Action: "Add",
        Properties: {
          Locale: "en-US",
        },
        Rows: [
          rowData,
        ],
      };
      return this._makeRequest({
        data: requestBody,
      });
    },
    async updateRow(rowId, fieldsToUpdate) {
      const requestBody = {
        Action: "Edit",
        Properties: {
          Locale: "en-US",
        },
        Rows: [
          {
            RowId: rowId,
            ...fieldsToUpdate,
          },
        ],
      };
      return this._makeRequest({
        data: requestBody,
      });
    },
    async deleteRow(rowId) {
      const requestBody = {
        Action: "Delete",
        Properties: {
          Locale: "en-US",
        },
        Rows: [
          {
            RowId: rowId,
          },
        ],
      };
      return this._makeRequest({
        data: requestBody,
      });
    },
  },
};
