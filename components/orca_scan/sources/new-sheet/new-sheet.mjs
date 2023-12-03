import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orca_scan-new-sheet",
  name: "New Sheet Created",
  description: "Emit new event when a new sheet is created in Orca Scan. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastInfo() {
      return this.db.get("lastId") || 0;
    },
    _setLastInfo(row) {
      return this.db.set("lastId", row._id);
    },
    async getData(maxResults = false, lastId) {
      const { data: sheets } = await this.orcaScan.listSheets();

      let pos = -1;
      let sortedSheets = sheets;
      if (lastId) {
        pos = sheets.findIndex((sheet) => sheet._id == lastId);
        if (pos != -1) sortedSheets = sheets.slice(pos + 1);
      }

      if (maxResults && sortedSheets.length >= maxResults) sortedSheets.length = maxResults;
      return sortedSheets.reverse();
    },
    getEmit(sheet) {
      return {
        id: sheet._id,
        summary: `New Sheet: ${sheet.name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
