import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  key: "microsoft_excel-new-item-created",
  name: "New Spreadsheet Created (Instant)",
  description: "Emit new event when a new Excel spreadsheet is created.",
  version: "0.0.2",
  type: "source",
  hooks: {
    ...common.hooks,
    async deploy() {
      this._setLastCreatedTs(Date.now());
    },
  },
  methods: {
    ...common.methods,
    _getLastCreatedTs() {
      return this.db.get("lastCreatedTs");
    },
    _setLastCreatedTs(lastCreatedTs) {
      this.db.set("lastCreatedTs", lastCreatedTs);
    },
    filterRelevantSpreadsheets(spreadsheets) {
      const lastCreatedTs = this._getLastCreatedTs();
      let maxTs = lastCreatedTs;
      const relevant = [];
      for (const spreadsheet of spreadsheets) {
        const ts = Date.parse(spreadsheet.createdDateTime);
        if (ts > lastCreatedTs) {
          relevant.push(spreadsheet);
          maxTs = Math.max(ts, maxTs);
        }
      }
      this._setLastCreatedTs(maxTs);
      return relevant;
    },
    generateMeta(item) {
      return {
        id: `${item.id}`,
        summary: `Item ${item.name} created`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
  sampleEmit,
};
