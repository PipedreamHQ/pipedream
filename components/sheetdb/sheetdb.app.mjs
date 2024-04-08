import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sheetdb",
  propDefinitions: {
    params: {
      type: "object",
      label: "Search Query",
      description: "An object to specify the search query for finding content in a Google Sheet.",
    },
    data: {
      type: "string[]",
      label: "Row Data",
      description: "An array of strings representing the rows to create or update in a Google Sheet as JSON objects.",
    },
    columnName: {
      type: "string",
      label: "Column Name",
      description: "The name of the column to match for delete operations.",
    },
    columnValue: {
      type: "string",
      label: "Column Value",
      description: "The value of the column to match for delete operations.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sheetdb.io/api/v1";
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
        url: `${this._baseUrl()}/${this.$auth.api_id}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async getColumnNames() {
      return this._makeRequest({
        path: "/keys",
      });
    },
    async searchContent(opts = {}) {
      return this._makeRequest({
        path: "/search",
        params: opts.params,
      });
    },
    async createRows(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "",
        data: {
          data: opts.data.map(JSON.parse),
        },
      });
    },
    async updateRows(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "",
        data: {
          data: opts.data.map(JSON.parse),
        },
      });
    },
    async deleteRows(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/search?${opts.columnName}=${encodeURIComponent(opts.columnValue)}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
