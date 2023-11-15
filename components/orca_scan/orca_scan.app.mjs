import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orca_scan",
  propDefinitions: {
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet where the row will be created or updated.",
    },
    rowData: {
      type: "object",
      label: "Row Data",
      description: "The data for the new row to be added or updated in JSON format.",
    },
    barcode: {
      type: "string",
      label: "Barcode",
      description: "The barcode value to locate a specific row record.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.orcascan.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async getSheets() {
      return this._makeRequest({
        path: "/sheets",
      });
    },
    async getFields(sheetId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/fields`,
      });
    },
    async getSettings(sheetId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/settings`,
      });
    },
    async clearSheet(sheetId) {
      return this._makeRequest({
        method: "PUT",
        path: `/sheets/${sheetId}/clear`,
      });
    },
    async getRows(sheetId, barcode) {
      const params = barcode
        ? {
          barcode,
        }
        : {};
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows`,
        params,
      });
    },
    async getSingleRow(sheetId, rowId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/${rowId}`,
      });
    },
    async addOrUpdateRow(sheetId, rowData, rowId) {
      const method = rowId
        ? "PUT"
        : "POST";
      const path = rowId
        ? `/sheets/${sheetId}/rows/${rowId}`
        : `/sheets/${sheetId}/rows`;
      return this._makeRequest({
        method,
        path,
        headers: {
          "Content-Type": "application/json",
        },
        data: rowData,
      });
    },
    async deleteRow(sheetId, rowId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sheets/${sheetId}/rows/${rowId}`,
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
