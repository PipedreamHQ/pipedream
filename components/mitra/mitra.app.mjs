import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mitra",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table in the database in case it was not set in the app.",
      optional: true,
    },
    records: {
      type: "string[]",
      label: "Records",
      description: "An array of records to insert or update, in JSON format.",
    },
  },
  methods: {
    getUrl(tableName, path) {
      const {
        url,
        table_name: defaultTableName,
      } = this.$auth;
      const baseUrl = `${url}/${tableName || defaultTableName}`;
      return path
        ? `${baseUrl}${path}`
        : baseUrl;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, tableName, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(tableName, path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        methot: "DELETE",
        ...args,
      });
    },
  },
};
