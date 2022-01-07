import axios from "axios";

export default {
  type: "app",
  app: "coda",
  propDefinitions: {
    title: {
      type: "string",
      label: "Doc Title",
      description: "Title of the doc",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
      optional: true,
    },
    sourceDoc: {
      type: "string",
      label: "Source Doc ID",
      description: "A doc ID from which to create a copy.",
      optional: true,
      async options () {
        return this._getKeyValuePair(
          (await this.listDocs()).items
        );
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "ID or name of the table",
      async options({ docId }) {
        return this._getKeyValuePair(
          (await this.listTables(docId)).items
        );
      },
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "ID or name of the column",
      async options({ docId, tableId }) {
        return this._getKeyValuePair(
          (await this.listColumns(docId, tableId)).items
        );
      },
    },
    isOwner: {
      type: "boolean",
      label: "Is Owner Docs",
      description: "Show only docs owned by the user.",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published Docs",
      description: "Show only published docs.",
      optional: true,
      default: false,
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Search term used to filter down results.",
      optional: true,
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred Docs",
      description: "If true, returns docs that are starred. If false, returns docs that are not starred.",
      optional: true,
      default: false,
    },
    inGallery: {
      type: "boolean",
      label: "In Gallery Docs",
      description: "Show only docs visible within the gallery.",
      optional: true,
      default: false,
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Show only docs belonging to the given workspace.",
      optional: true,
    },
    visibleOnly: {
      type: "boolean",
      label: "visibleOnly",
      description: "If true, returns only visible rows and columns for the table",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "sortBy",
      description: "Determines how to sort the given objects.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return in this query.",
      default: 25,
      min: 1,
      max: 50,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "An opaque token used to fetch the next page of results.",
      optional: true,
    },
    paginate: {
      type: "boolean",
      label: "Auto-Paginate",
      description: "By default, list all docs matching search results across all result pages. Set to `false` to limit results to the first page.",
      optional: true,
      default: true,
    },
  },
  methods: {
    _getKeyValuePair(list) {
      return list.map(
        (e) => ({
          label: e.name,
          value: e.id,
        })
      );
    },
    _removeEmptyKeyValues(dict) {
      Object.keys(dict).forEach((key) => (dict[key] === null
        || dict[key] === undefined
        || dict[key] === "")
        && delete dict[key]);
      return dict;
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    /**
     * Creates a new Coda doc
     *
     * @param {string} title - Title of the new doc
     * @param {string} folderId - The ID of the folder within to create this
     * doc
     * @param {string} [sourceDoc] - An optional doc ID from which to create a
     * copy
     * @returns {string} ID of the newly created doc
     */
    async createDoc(title, folderId, sourceDoc = "") {
      const config = {
        method: "post",
        url: "https://coda.io/apis/v1/docs",
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        data: {
          title,
          folderId,
          sourceDoc,
        },
      };
      return (await axios(config)).data.id;
    },
    /**
     * List Coda docs according to parameters
     *
     * @param {object} [params] - Optional Query Parameters
     * @param {boolean} params.isOwner
     * @param {boolean} params.isPublished
     * @param {string} params.query
     * @param {string} params.sourceDoc
     * @param {boolean} params.isStarred
     * @param {boolean} params.inGallery
     * @param {string} params.workspaceId
     * @param {string} params.folderId
     * @param {int} params.limit
     * @param {string} params.pageToken
     *
     * @returns {object[]} Array of listed Docs
     */
    async listDocs(params = {}) {
      const config = {
        method: "get",
        url: "https://coda.io/apis/v1/docs",
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: this._removeEmptyKeyValues(params),
      };
      return (await axios(config)).data;
    },
    /**
     * Returns a list of tables in a Coda doc according to parameters
     * @param {object} [params] - Optional Query Parameters
     * @param {int} params.limit
     * @param {string} params.pageToken
     * @param {string} params.sortBy
     * @param {string} params.tableTypes
     *
     * @returns {object[]} Array of tables
     */
    async listTables(docId, params = {}) {
      const config = {
        method: "get",
        url: `https://coda.io/apis/v1/docs/${docId}/tables`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: this._removeEmptyKeyValues(params),
      };
      return (await axios(config)).data;
    },
    /**
     * Searches for a Coda row in the selected table using a column match search
     * @param {*} docId
     * @param {*} tableId
     * @param {object} [params] - Optional Query Parameters
     * @param {string} [params.query]
     * @param {string} [params.sortBy]
     * @param {boolean} [params.useColumnNames]
     * @param {string} [params.valueFormat]
     * @param {boolean} [params.visibleOnly]
     * @param {int} [params.limit]
     * @param {string} [params.pageToken]
     * @param {string} [params.syncToken]
     * @returns {object[]} Array of rows
     */
    async findRow(docId, tableId, params = {}) {
      const config = {
        method: "get",
        url: `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: this._removeEmptyKeyValues(params),
      };
      return (await axios(config)).data;
    },
    /**
     * Returns a list of columns in a doc table.
     *
     * @param {string} docId
     * @param {string} tableId
     * @param {object} [params]
     * @param {object} params.limit
     * @param {object} params.pageToken
     * @param {object} params.visibleOnly
     * @returns {object[]} Array of columns
     */
    async listColumns(docId, tableId, params = {}) {
      const config = {
        method: "get",
        url: `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: this._removeEmptyKeyValues(params),
      };
      return (await axios(config)).data;
    },
    /**
     * Inserts rows into a table, optionally updating existing rows if any upsert key columns are provided.
     * This endpoint will always return a 202, so long as the doc and table exist and are accessible (and the update is
     * structurally valid). Row inserts/upserts are generally processed within several seconds.
     *
     * @param {string} docId
     * @param {string} tableId
     * @param {object} data
     * @param {object} data.rows
     * @param {string[]} [data.keyColumns]
     * @param {object} [params]
     * @param {boolean} [params.disableParsing]
     * @returns {object[]} Array of addedRows and requestId
     */
    async createRows(docId, tableId, data, params = {}) {
      const config = {
        method: "post",
        url: `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: this._removeEmptyKeyValues(params),
        data,
      };
      return (await axios(config)).data;
    },
  },
};
