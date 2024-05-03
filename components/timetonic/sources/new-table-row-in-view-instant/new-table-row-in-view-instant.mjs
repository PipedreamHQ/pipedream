import timetonic from "../../timetonic.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "timetonic-new-table-row-in-view-instant",
  name: "New Table Row in View (Instant)",
  description: "Emit new event when a new table row appears in a specific view.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    timetonic,
    db: "$.service.db",
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
      ],
    },
    viewId: {
      propDefinition: [
        timetonic,
        "viewId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(row) {
      const {
        id, lastModified,
      } = row;
      return {
        id,
        summary: `New Row: ${id}`,
        ts: Date.parse(lastModified),
      };
    },
  },
  hooks: {
    async deploy() {
      const rows = await this.timetonic.searchTableRows(this.tableId, "", 50);
      for (const row of rows) {
        this.$emit(row, this.generateMeta(row));
      }
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.now();
    const rows = await this.timetonic.searchTableRows(this.tableId, "", 50);
    for (const row of rows) {
      if (Date.parse(row.lastModified) > Date.parse(lastRunTime)) {
        this.$emit(row, this.generateMeta(row));
      }
    }
    this.db.set("lastRunTime", this.now());
  },
};
