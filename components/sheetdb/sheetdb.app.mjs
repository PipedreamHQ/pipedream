import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sheetdb",
  propDefinitions: {
    params: {
      type: "object",
      label: "Search Query",
      description: "An object to specify the search query for finding content in a Google Sheet. The key is the column name and the value is the value to search for in that column. Eg. `{\"column1\": \"My Content\"}`.",
    },
    data: {
      type: "string[]",
      label: "Row Data",
      description: "An array of strings representing the rows to create or update in a Google Sheet as JSON objects. The keys inside the object should be the column names, and the values will be filled in the spreadsheet. The rows will be added at the end of the sheet. Eg. `[ { \"column1\": \"My Content\" } ]`",
    },
    columnName: {
      type: "string",
      label: "Column Name",
      description: "The name of the column.",
      async options() {
        const columns = await this.getKeys();
        return columns.map((value) => value);
      },
    },
    columnValue: {
      type: "string",
      label: "Column Value",
      description: "The value of the column to match for update/delete operations.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sheetdb.io/api/v1";
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path = "", headers, ...args
    } = {}) {
      try {
        const response = await axios($, {
          ...args,
          debug: true,
          url: `${this._baseUrl()}/${this.$auth.api_id}${path}`,
          headers: this.getHeaders(headers),
        });

        return response;

      } catch (error) {
        const STAUS_ERROR_CODES = [
          400,
          404,
        ];
        if (STAUS_ERROR_CODES.includes(error.response?.status)) {
          return error.response.data;
        }
        throw error;
      }
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    getKeys(args = {}) {
      return this._makeRequest({
        path: "/keys",
        ...args,
      });
    },
  },
};
