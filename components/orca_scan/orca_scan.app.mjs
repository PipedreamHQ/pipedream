import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orca_scan",
  propDefinitions: {
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet where the row will be created or updated.",
      async options({ page }) {
        const { data } = await this.listSheets({
          params: {
            page,
          },
        });

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
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
    _getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listSheets() {
      return this._makeRequest({
        path: "/sheets",
      });
    },
    getFields(sheetId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/fields`,
      });
    },
    getSettings(sheetId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/settings`,
      });
    },
    clearSheet(sheetId) {
      return this._makeRequest({
        method: "PUT",
        path: `/sheets/${sheetId}/clear`,
      });
    },
    listRows({
      sheetId, ...opts
    }) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows`,
        ...opts,
      });
    },
    getSingleRow(sheetId, rowId) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/${rowId}`,
      });
    },
    addOrUpdateRow({
      sheetId, rowId, ...opts
    }) {
      const method = rowId
        ? "PUT"
        : "POST";
      const path = `/sheets/${sheetId}/rows${rowId
        ? `/${rowId}`
        : ""}`;
      return this._makeRequest({
        method,
        path,
        ...opts,
      });
    },
    deleteRow(sheetId, rowId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sheets/${sheetId}/rows/${rowId}`,
      });
    },
  },
};
