import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_sheet",
  propDefinitions: {
    worksheet: {
      type: "string",
      label: "Worksheet",
      description: "The name or ID of the worksheet",
      async options() {
        const worksheets = await this.listWorksheets();
        return worksheets.map((ws) => ({
          label: ws.name,
          value: ws.id,
        }));
      },
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data for the row content, including the column headers as keys",
    },
    criteria: {
      type: "object",
      label: "Criteria",
      description: "Conditions to locate the row to delete",
    },
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "The index of the row to update",
    },
    location: {
      type: "string",
      label: "Workbook Location",
      description: "Optional: Specific location to monitor in Zoho Sheet",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.zohoapis.com/sheet/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listWorksheets() {
      return this._makeRequest({
        path: "/worksheets",
      });
    },
    async emitNewRowEvent({
      worksheet, ...opts
    }) {
      const path = `/workbooks/${worksheet}/new_row_event`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async emitRowChangeEvent({
      worksheet, ...opts
    }) {
      const path = `/workbooks/${worksheet}/row_change_event`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async emitNewWorkbookEvent({
      location, ...opts
    }) {
      const path = "/workbooks/new_workbook_event";
      const params = location
        ? {
          location,
        }
        : {};
      return this._makeRequest({
        ...opts,
        path,
        params,
      });
    },
    async createRow({
      worksheet, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/worksheet/${worksheet}/row`,
        data,
      });
    },
    async deleteRow({
      worksheet, criteria,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/worksheet/${worksheet}/row`,
        params: {
          criteria,
        },
      });
    },
    async updateRow({
      worksheet, rowIndex, data,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/worksheet/${worksheet}/row/${rowIndex}`,
        data,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let page = 1;
      let response;

      do {
        response = await fn({
          ...opts,
          params: {
            ...opts.params,
            page,
          },
        });
        results = results.concat(response);
        page += 1;
      } while (response && response.length > 0);

      return results;
    },
  },
};
