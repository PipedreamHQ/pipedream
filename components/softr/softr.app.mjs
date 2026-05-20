import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "softr",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the Softr database",
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table within the database",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update",
    },
  },
  methods: {
    _baseUrl() {
      return "https://studio-api.softr.io/v1/api";
    },
    _databaseBaseUrl() {
      return "https://tables-api.softr.io/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Softr-Api-Key": `${this.$auth.api_key}`,
          "Softr-Domain": `${this.$auth.domain}`,
          "Content-Type": "application/json",
        },
      });
    },
    _makeDatabaseRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._databaseBaseUrl()}${path}`,
        headers: {
          "Softr-Api-Key": `${this.$auth.api_key}`,
          "Softr-Domain": `${this.$auth.domain}`,
          "Content-Type": "application/json",
        },
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    deleteUser({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/users/${email}`,
        ...opts,
      });
    },
    generateMagicLink({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/magic-link/generate/${email}`,
        ...opts,
      });
    },
    updateRecord({
      databaseId, tableId, recordId, ...opts
    }) {
      return this._makeDatabaseRequest({
        method: "PATCH",
        path: `/databases/${databaseId}/tables/${tableId}/records/${recordId}`,
        ...opts,
      });
    },
    searchRecords({
      databaseId, tableId, ...opts
    }) {
      return this._makeDatabaseRequest({
        method: "POST",
        path: `/databases/${databaseId}/tables/${tableId}/records/search`,
        ...opts,
      });
    },
  },
};
