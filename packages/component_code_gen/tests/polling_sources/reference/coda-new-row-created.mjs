import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "coda-new-row-created",
  name: "New Row Created",
  description: "Emit new event for every created / updated row in a table. [See the docs here.](https://coda.io/developers/apis/v1#tag/Rows/operation/listRows)",
  type: "source",
  version: "0.0.1",
  props: {
    coda: {
      type: "app",
      app: "coda",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    docId: {
      prtype: "string",
      label: "Doc ID",
      description: "ID of the Doc",
      async options({ prevContext }) {
        const response = await this.listDocs(this, {
          pageToken: prevContext.nextPageToken,
        });
        return this._makeOptionsResponse(response);
      },
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
    includeUpdates: {
      type: "boolean",
      label: "Include Updated Rows",
      description: "Emit events for updates on existing rows?",
      optional: true,
    },
  },
  methods: {
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
    async _makeRequest($, opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.Authorization = `Bearer ${this.coda.$auth.api_token}`;
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
    async listDocs($, params = {}) {
      let opts = {
        path: "/docs",
        params,
      };
      return await this._makeRequest($, opts);
    },
    async listTables($, docId, params = {}) {
      let opts = {
        path: `/docs/${docId}/tables`,
        params,
      };
      return await this._makeRequest($, opts);
    },
    async findRow($, docId, tableId, params = {}) {
      let opts = {
        path: `/docs/${docId}/tables/${tableId}/rows`,
        params,
      };
      return await this._makeRequest($, opts);
    },
    _getEmittedRows() {
      return this.db.get("emittedRows") || [];
    },
    _setEmittedRows(rows) {
      this.db.set("emittedRows", rows);
    },
    _getNextPageToken() {
      return this.db.get("nextPageToken");
    },
    _setNextPageToken(nextPageToken) {
      nextPageToken && this.db.set("nextPageToken", nextPageToken);
    },
    async fetchRows() {
      const rows = [];
      let nextPageToken = this._getNextPageToken();
      const params = {
        pageToken: nextPageToken,
      };

      while (true) {
        const {
          items = [],
          nextPageToken,
        } = await this.findRow(
          null,
          this.docId,
          this.tableId,
          params,
        );

        rows.push(...items);
        params.pageToken = nextPageToken;
        this._setNextPageToken(nextPageToken);

        if (!nextPageToken) {
          return rows;
        }
      }
    },
    rowSummary(row) {
      const name = row.name && ` - ${row.name}` || "";
      return `Row index: ${row.index}` + name;
    },
    emitEvents(events) {
      const emittedRows = this._getEmittedRows();

      for (const row of events) {
        const id = this.includeUpdates
          ? `${row.id}-${row.updatedAt}`
          : row.id;

        if (!emittedRows.includes(id)) {
          emittedRows.unshift(id);
          this.$emit(row, {
            id,
            summary: this.rowSummary(row),
            ts: row.updatedAt,
          });
        }
      }

      this._setEmittedRows(emittedRows);
    },
  },
  async run() {
    const rows = await this.fetchRows();
    this.emitEvents(rows.reverse());
  },
};
