import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_sheet",
  propDefinitions: {
    workbookId: {
      type: "string",
      label: "Worksheet",
      description: "The ID of the workbook (Spreadsheet)",
      async options() {
        const { workbooks } = await this.listWorkbooks({});
        return workbooks.map(({
          resource_id: value, workbook_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    worksheet: {
      type: "string",
      label: "Worksheet",
      description: "The ID of the worksheet (Sheet of the Spreadsheet)",
      async options({ workbookId }) {
        const { worksheet_names: worksheets } = await this.listWorksheets({
          workbookId,
        });
        return worksheets.map(({
          worksheet_id: value, worksheet_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    data: {
      type: "string[]",
      label: "JSON Data",
      description: "An array of objects of the data for the row content, including the column headers as keys. **Example: {\"Name\":\"Joe\",\"Region\":\"South\",\"Units\":284}**",
    },
    headerRow: {
      type: "integer",
      label: "Header Row",
      description: "By default, first row of the worksheet is considered as header row. This can be used if tabular data starts from any row other than the first row..",
    },
    criteria: {
      type: "string",
      label: "Criteria",
      description: "Conditions to locate the row to delete. **Example: \"Month\"=\"March\" and \"Amount\">50**",
    },
    firstMatchOnly: {
      type: "boolean",
      label: "First Match Only",
      description: "If true and if there are multiple records on the specified criteria, records will be deleted for first match alone. Otherwise, all the matched records will be deleted. This parameter will be ignored if criteria is not mentioned.",
      default: false,
    },
    isCaseSensitive: {
      type: "boolean",
      label: "Is Case Sensitive",
      description: "Can be set as false for case insensitive search.",
      default: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://sheet.${this.$auth.base_api_uri}/api/v2`;
    },
    _headers() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _makeRequest({
      $ = this, path, data, method, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: {
          ...data,
          method,
        },
        ...opts,
      });
    },
    listWorkbooks(opts = {}) {
      return this._makeRequest({
        path: "/workbooks",
        method: "workbook.list",
        ...opts,
      });
    },
    listWorksheets({
      workbookId, ...opts
    }) {
      return this._makeRequest({
        path: `/${workbookId}`,
        method: "worksheet.list",
        ...opts,
      });
    },
    createRow({
      workbookId, ...opts
    }) {
      return this._makeRequest({
        path: `/${workbookId}`,
        method: "worksheet.records.add",
        ...opts,
      });
    },
    deleteRow({
      workbookId, ...opts
    }) {
      return this._makeRequest({
        path: `/${workbookId}`,
        method: "worksheet.records.delete",
        ...opts,
      });
    },
    updateRow({
      workbookId, ...opts
    }) {
      return this._makeRequest({
        path: `/${workbookId}`,
        method: "worksheet.records.update",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhook",
        method: "webhook.subscribe",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhook",
        method: "webhook.unsubscribe",
        ...opts,
      });
    },
  },
};
