import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coda",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Title of the doc. Defaults to `\"Untitled\"`",
      optional: true,
    },
    docId: {
      type: "string",
      label: "Doc ID",
      description: "ID of the Doc",
      async options({ prevContext }) {
        const response = await this.listDocs(this, {
          pageToken: prevContext.nextPageToken,
        });
        return this._makeOptionsResponse(response);
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "ID of the folder",
      optional: true,
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "ID of the table",
      async options({
        docId,
        prevContext,
      }) {
        const response = await this.listTables(this, docId, {
          pageToken: prevContext.nextPageToken,
        });
        return this._makeOptionsResponse(response);
      },
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "ID of the row",
      async options({
        docId, tableId, prevContext,
      }) {
        let { counter = 0 } = prevContext;
        const response = await this.findRow(this, docId, tableId, {
          pageToken: prevContext.nextPageToken,
          sortBy: "natural",
        });

        const {
          options,
          context,
        } = this._makeOptionsResponse(response);

        return {
          options: options
            .map((row) => ({
              label: `${counter++}: ${row.label}`,
              value: row.value,
            })),
          context: {
            ...context,
            counter,
          },
        };
      },
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "ID of the column",
      optional: true,
      async options({
        docId, tableId, prevContext,
      }) {
        const response = await this.listColumns(this, docId, tableId, {
          pageToken: prevContext.nextPageToken,
        });
        return this._makeOptionsResponse(response);
      },
    },
    keyColumns: {
      type: "string[]",
      label: "Key of columns to be upserted",
      description: "Optional column IDs, specifying columns to be used as upsert keys",
      async options({
        docId, tableId, prevContext,
      }) {
        const response = await this.listColumns(this, docId, tableId, {
          pageToken: prevContext.nextPageToken,
        });
        return this._makeOptionsResponse(response);
      },
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Search term used to filter down results",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Determines how to sort the given objects",
      optional: true,
      options: [
        "name",
      ],
    },
    disableParsing: {
      type: "boolean",
      label: "Disable Parsing",
      description: "If true, the API will not attempt to parse the data in any way",
      optional: true,
    },
    visibleOnly: {
      type: "boolean",
      label: "Visible Only",
      description: "If true, returns only visible rows and columns for the table",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Items",
      description: "Maximum number of results to return in this query",
      optional: true,
    },
  },
  methods: {
    async _makeRequest($, opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.Authorization = `Bearer ${this.$auth.api_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      if (!opts.method) opts.method = "get";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://coda.io/apis/v1${path[0] === "/"
        ? ""
        : "/"}${path}`;
      try {
        return await axios($ ?? this, opts);
      } catch (err) {
        this._throwFormattedError(err);
      }
    },
    _throwFormattedError(err) {
      err = err.response.data;
      throw Error(`${err.statusCode} - ${err.statusMessage} - ${err.message}`);
    },
    _makeOptionsResponse(response) {
      return {
        options: response.items
          .map((e) => ({
            label: e.name,
            value: e.id,
          })),
        context: {
          nextPageToken: response.nextPageToken,
        },
      };
    },
    createRowCells(component) {
      return Object.keys(component)
        .filter((k) => k.startsWith("col_") && component[k])
        .map((k) => ({
          column: k.slice(4),
          value: component[k],
        }));
    },
    /**
     * Creates a new doc or copies a doc from a source docId
     * @param {object} $
     * @param {object} [data]
     * @param {object} [data.title]
     * @param {object} [data.folderId]
     * @param {object} [data.sourceDoc]
     * @return {object} Created or copied doc
     */
    async createDoc($, data = {}) {
      let opts = {
        method: "post",
        path: "/docs",
        data,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * List docs according to query parameters
     * @param {object}  $
     * @param {object}  [params]
     * @param {string}  [params.docId]
     * @param {string}  [params.workspaceId]
     * @param {string}  [params.folderId]
     * @param {string}  [params.query]
     * @param {boolean} [params.isOwner]
     * @param {boolean} [params.isPublished]
     * @param {boolean} [params.isStarred]
     * @param {boolean} [params.inGallery]
     * @return {object[]} List of docs
     */
    async listDocs($, params = {}) {
      let opts = {
        path: "/docs",
        params,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * Lists tables in a doc according to parameters
     * @param {object} $
     * @param {string} docId
     * @param {object} [params]
     * @param {string} [params.sortBy]
     * @param {string} [params.tableTypes]
     * @return {object[]} List of tables
     */
    async listTables($, docId, params = {}) {
      let opts = {
        path: `/docs/${docId}/tables`,
        params,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * Searches for a row in the selected table using a column match search
     * @param {object}  $
     * @param {string}  docId
     * @param {string}  tableId
     * @param {object}  [params]
     * @param {string}  [params.query]
     * @param {string}  [params.sortBy]
     * @param {boolean} [params.visibleOnly]
     * @param {boolean} [params.useColumnNames]
     * @param {string}  [params.valueFormat]
     * @return {object[]} List of rows
     */
    async findRow($, docId, tableId, params = {}) {
      let opts = {
        path: `/docs/${docId}/tables/${tableId}/rows`,
        params,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * Returns a list of columns in a doc table.
     * @param {object} $
     * @param {string} docId
     * @param {string} tableId
     * @param {object} [params]
     * @param {object} [params.visibleOnly]
     * @return {object[]} List of columns
     */
    async listColumns($, docId, tableId, params = {}) {
      let opts = {
        path: `/docs/${docId}/tables/${tableId}/columns`,
        params,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * Inserts rows into a table, optionally updating existing rows using upsert key columns
     * @param {object}    $
     * @param {string}    docId
     * @param {string}    tableId
     * @param {object}    data
     * @param {object}    data.rows
     * @param {string[]}  [data.keyColumns]
     * @param {object}    [params]
     * @param {boolean}   [params.disableParsing]
     * @return {object[]} List of added rows and requestId
     */
    async createRows($, docId, tableId, data, params = {}) {
      let opts = {
        method: "post",
        path: `/docs/${docId}/tables/${tableId}/rows`,
        params,
        data,
      };
      return await this._makeRequest($, opts);
    },
    /**
     * Updates the specified row in the table
     * @param {object}  $
     * @param {string}  docId
     * @param {string}  tableId
     * @param {string}  rowId
     * @param {object}  data
     * @param {object}  data.row
     * @param {object}  [params]
     * @param {boolean} [params.disableParsing]
     * @return {object[]} Updated rowId and requestId
     */
    async updateRow($, docId, tableId, rowId, data, params = {}) {
      let opts = {
        method: "put",
        path: `/docs/${docId}/tables/${tableId}/rows/${rowId}`,
        params,
        data,
      };
      return await this._makeRequest($, opts);
    },
  },
};
