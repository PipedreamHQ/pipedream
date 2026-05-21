import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "softr",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user (e.g., `john.doe@example.com`)",
    },
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the Softr database (e.g., `aBcDeFgHiJ`). Use the **List Databases** action to get the ID of a database.",
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table within the database (e.g., `kLmNoPqRsT`). Use the **List Tables** action to get the ID of a table.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update (e.g., `uVwXyZ1234`). Use the **Search Records** action to get the ID of a record.",
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view to fetch (e.g., `mNoPqRsT56`). Use the **List Views** action to get the ID of a view.",
    },
    fieldNames: {
      type: "boolean",
      label: "Field Names",
      description: "If true, use field names as keys in the response fields object instead of field IDs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of records to return",
      optional: true,
      default: 100,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of records to skip before returning results",
      optional: true,
      default: 0,
      min: 0,
    },
  },
  methods: {
    _baseUrl() {
      return "https://studio-api.softr.io/v1/api";
    },
    _databaseBaseUrl() {
      return "https://tables-api.softr.io/api/v1";
    },
    _headers() {
      return {
        "Softr-Api-Key": `${this.$auth.api_key}`,
        "Softr-Domain": `${this.$auth.domain}`,
        "Content-Type": "application/json",
      };
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
        headers: this._headers(),
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
        headers: this._headers(),
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
    listDatabases(opts = {}) {
      return this._makeDatabaseRequest({
        path: "/databases",
        ...opts,
      });
    },
    listTables({
      databaseId, ...opts
    }) {
      return this._makeDatabaseRequest({
        path: `/databases/${databaseId}/tables`,
        ...opts,
      });
    },
    listRecords({
      databaseId, tableId, ...opts
    }) {
      return this._makeDatabaseRequest({
        path: `/databases/${databaseId}/tables/${tableId}/records`,
        ...opts,
      });
    },
    listViews({
      databaseId, tableId, ...opts
    }) {
      return this._makeDatabaseRequest({
        path: `/databases/${databaseId}/tables/${tableId}/views`,
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
