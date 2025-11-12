import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import coda from "../../coda.app.mjs";

export default {
  key: "coda-row-created",
  name: "New Row Created",
  description: "Emit new event for every created / updated row in a table. [See the documentation.](https://coda.io/developers/apis/v1#tag/Rows/operation/listRows)",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
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
    includeUpdates: {
      type: "boolean",
      label: "Include Updated Rows",
      description: "Emit events for updates on existing rows?",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const rows = await this.fetchRows(25);
      this.emitEvents(rows.reverse());
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTsKey() {
      return this.includeUpdates
        ? "updatedAt"
        : "createdAt";
    },
    async fetchRows(maxResults) {
      const rows = [];
      const tsKey = this.getTsKey();
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      let done = false;

      const params = {
        sortBy: tsKey,
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
        for (const item of items) {
          const ts = Date.parse(item[tsKey]);
          if (ts > lastTs) {
            rows.push(item);
            if (ts > maxTs) {
              maxTs = ts;
            }
            if (rows.length >= maxResults) {
              done = true;
              break;
            }
          }
          else {
            done = true;
          }
        }
        params.pageToken = nextPageToken;

        if (!nextPageToken || done) {
          this._setLastTs(maxTs);
          return rows;
        }
      }
    },
    rowSummary(row) {
      const name = row.name && ` - ${row.name}` || "";
      return `Row index: ${row.index}` + name;
    },
    emitEvents(events) {
      for (const row of events) {
        const id = this.includeUpdates
          ? `${row.id}-${row.updatedAt}`
          : row.id;

        this.$emit(row, {
          id,
          summary: this.rowSummary(row),
          ts: row.updatedAt,
        });
      }
    },
  },
  async run() {
    const rows = await this.fetchRows();
    this.emitEvents(rows.reverse());
  },
};
