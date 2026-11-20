import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "microsoft_excel-new-row-added",
  name: "New Row Added",
  description: "Emit new event when a new row is added to an Excel worksheet",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _rowCountKey() {
      return `rowCount:${this.driveId || "me"}:${this.sheetId}:${this.worksheet}`;
    },
    _getRowCount() {
      return this.db.get(this._rowCountKey());
    },
    _setRowCount(value) {
      this.db.set(this._rowCountKey(), value);
      // The pre-upgrade baseline has no workbook or worksheet, so it is retired, not reused
      const legacyRowCount = this.db.get("rowCount");
      if (legacyRowCount !== undefined && legacyRowCount !== null) {
        this.db.set("rowCount", null);
      }
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
      driveId: this.driveId,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });

    const { rowCount } = response;

    if (previousRowCount && rowCount > previousRowCount) {
      response.numRowsAdded = rowCount - previousRowCount;
      this.emitEvent(response);
    }

    this._setRowCount(rowCount);
  },
};
