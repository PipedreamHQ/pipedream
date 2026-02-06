import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "microsoft_excel-new-row-added",
  name: "New Row Added",
  description: "Emit new event when a new row is added to an Excel worksheet",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getRowCount() {
      return this.db.get("rowCount");
    },
    _setRowCount(value) {
      this.db.set("rowCount", value);
    },
    generateMeta(item) {
      const ts = Date.now();
      return {
        id: `${item.address}${ts}`,
        summary: `${item.numRowsAdded} row(s) added`,
        ts,
      };
    },
  },
  async run() {
    const previousRowCount = this._getRowCount();

    const response = await this.microsoftExcel.getUsedRange({
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });

    const { rowCount } = response;

    this._setRowCount(rowCount);

    if (!previousRowCount || rowCount <= previousRowCount) {
      return;
    }

    response.numRowsAdded = rowCount - previousRowCount;
    this.emitEvent(response);
  },
};
