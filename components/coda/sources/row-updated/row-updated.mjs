import coda from "../../coda.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "coda-row-updated",
  name: "Row Updated",
  description: "Emit new event for every updated row in a table. [See the docs here.](https://coda.io/developers/apis/v1#tag/Rows/operation/listRows)",
  type: "source",
  version: "0.0.1",
  props: {
    coda,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
    },
    tableId: {
      propDefinition: [
        coda,
        "tableId",
        (c) => ({
          docId: c.docId,
        }),
      ],
    },
  },
  methods: {
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
    rowSummary(row) {
      const name = row.name && ` - ${row.name}` || "";
      return `Row index: ${row.index}` + name;
    },
  },
  async run() {
    const rows = [];
    const emittedRows = this._getEmittedRows();
    let nextPageToken = this._getNextPageToken();
    const params = {
      pageToken: nextPageToken,
    };

    while (true) {
      const {
        items = [],
        nextPageToken,
      } = await this.coda.findRow(
        null,
        this.docId,
        this.tableId,
        params,
      );

      rows.push(...items);
      params.pageToken = nextPageToken;
      this._setNextPageToken(nextPageToken);

      if (!nextPageToken) {
        break;
      }
    }

    for (const row of rows.reverse()) {
      if (!emittedRows.includes(row.id)) {
        this.$emit(row, {
          id: row.id,
          summary: this.rowSummary(row),
          ts: row.updatedAt,
        });

        emittedRows.unshift(row.id);
      }
    }

    this._setEmittedRows(emittedRows);
  },
};
