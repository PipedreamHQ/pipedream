import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_appsheet",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      description: "Name of the table. **Select Data > Tables** and expand the table details to view the table name.",
    },
    row: {
      type: "object",
      label: "Row",
      description: "JSON object representing the row data",
    },
  },
  methods: {
    _baseUrl(tableName) {
      return `https://api.appsheet.com/api/v2/apps/${this.$auth.app_id}/tables/${encodeURIComponent(tableName)}/Action`;
    },
    _headers() {
      return {
        "ApplicationAccessKey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, tableName, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(tableName),
        headers: this._headers(),
        ...opts,
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};
