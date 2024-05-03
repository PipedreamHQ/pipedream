import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timetonic",
  propDefinitions: {
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      required: true,
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view",
      optional: true,
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The fields for the row",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search criteria",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of rows to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://timetonic.com/live/api.php";
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
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitNewTableRowEvent(tableId, fields) {
      return this._makeRequest({
        method: "POST",
        path: "/createOrUpdateTableRow",
        data: {
          req: "createOrUpdateTableRow",
          version: "0.0.{{ts}}",
          rowId: `tmp${Math.random().toString(36)
            .substr(2, 9)}`,
          fieldValues: JSON.stringify(fields),
          tabId: tableId,
        },
      });
    },
    async emitNewTableRowInViewEvent(tableId, viewId, fields) {
      return this._makeRequest({
        method: "POST",
        path: "/createOrUpdateTableRow",
        data: {
          req: "createOrUpdateTableRow",
          version: "0.0.{{ts}}",
          rowId: `tmp${Math.random().toString(36)
            .substr(2, 9)}`,
          fieldValues: JSON.stringify(fields),
          tabId: tableId,
          viewId: viewId,
        },
      });
    },
    async createNewRow(tableId, fields) {
      return this._makeRequest({
        method: "POST",
        path: "/createOrUpdateTableRow",
        data: {
          req: "createOrUpdateTableRow",
          version: "0.0.{{ts}}",
          rowId: `tmp${Math.random().toString(36)
            .substr(2, 9)}`,
          fieldValues: JSON.stringify(fields),
          tabId: tableId,
        },
      });
    },
    async searchTableRows(tableId, query, limit) {
      return this._makeRequest({
        method: "POST",
        path: "/getTableValues",
        data: {
          req: "getTableValues",
          version: "0.0.{{ts}}",
          catId: tableId,
          filterRowIds: JSON.stringify({
            applyViewFilters: {
              filterGroup: {
                operator: "and",
                filters: [
                  {
                    id: "tmpId",
                    json: {
                      predicate: "is",
                      operand: query,
                    },
                    field_id: "1735324",
                    filter_type: "text",
                  },
                ],
              },
            },
          }),
          format: "rows",
          maxRows: limit,
        },
      });
    },
    async editTableRow(tableId, rowId, fields) {
      return this._makeRequest({
        method: "POST",
        path: "/createOrUpdateTableRow",
        data: {
          req: "createOrUpdateTableRow",
          version: "0.0.{{ts}}",
          rowId: rowId,
          fieldValues: JSON.stringify(fields),
          tabId: tableId,
        },
      });
    },
  },
};
