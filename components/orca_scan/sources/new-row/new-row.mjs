import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orca_scan-new-row",
  name: "New Row in Orca Scan Sheet",
  description: "Emit new event when a new row is created in an Orca Scan sheet. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetId: {
      propDefinition: [
        common.props.orcaScan,
        "sheetId",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastInfo() {
      return this.db.get("lastDate") || 0;
    },
    _setLastInfo(row) {
      return this.db.set("lastDate", row.date);
    },
    async getData(maxResults = false, lastDate) {
      const { data: rows } = await this.orcaScan.listRows({
        sheetId: this.sheetId,
      });

      const sortedRows = rows
        .filter((row) => new Date(row.date) > new Date(lastDate))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (maxResults && sortedRows.length >= maxResults) sortedRows.length = maxResults;
      return sortedRows;
    },
    getEmit(row) {
      return {
        id: row._id,
        summary: `New row with _id: ${row._id}`,
        ts: row.date,
      };
    },
  },
  sampleEmit,
};
