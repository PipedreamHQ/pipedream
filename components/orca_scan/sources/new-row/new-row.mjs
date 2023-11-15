import orcaScan from "../../orca_scan.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "orca_scan-new-row",
  name: "New Row in Orca Scan Sheet",
  description: "Emits an event when a new row is created in an Orca Scan sheet. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    orca_scan,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    sheetId: {
      propDefinition: [
        orcaScan,
        "sheetId",
      ],
    },
  },
  methods: {
    _getMaxTimestamp(rows) {
      if (rows.length === 0) {
        return 0;
      }
      const timestamps = rows.map((row) => new Date(row.date).getTime());
      return Math.max(...timestamps);
    },
  },
  hooks: {
    async deploy() {
      const rows = await this.orca_scan.getRows(this.sheetId);
      const maxTimestamp = this._getMaxTimestamp(rows);
      this.db.set("maxTimestamp", maxTimestamp);

      // Emit up to 50 most recent rows
      const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentRows = sortedRows.slice(0, 50);
      for (const row of recentRows) {
        this.$emit(row, {
          id: row._id,
          summary: `New row: ${row.barcode}`,
          ts: new Date(row.date).getTime(),
        });
      }
    },
  },
  async run() {
    const lastMaxTimestamp = this.db.get("maxTimestamp") || 0;
    let newMaxTimestamp = lastMaxTimestamp;

    const rows = await this.orca_scan.getRows(this.sheetId);
    const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const row of sortedRows) {
      const rowTimestamp = new Date(row.date).getTime();
      if (rowTimestamp > lastMaxTimestamp) {
        this.$emit(row, {
          id: row._id,
          summary: `New row: ${row.barcode}`,
          ts: rowTimestamp,
        });
        newMaxTimestamp = Math.max(newMaxTimestamp, rowTimestamp);
      }
    }

    this.db.set("maxTimestamp", newMaxTimestamp);
  },
};
