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
      const rowCount = this.db.get(this._rowCountKey());
      if (rowCount !== undefined || this.driveId) {
        return rowCount;
      }
      // Baseline stored before it was keyed by drive, workbook and worksheet; consumed once
      const legacyRowCount = this.db.get("rowCount");
      if (legacyRowCount !== undefined) {
        this.db.set("rowCount", undefined);
      }
      return legacyRowCount;
    },
    _setRowCount(value) {
      this.db.set(this._rowCountKey(), value);
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

    this._setRowCount(rowCount);

    if (!previousRowCount || rowCount <= previousRowCount) {
      return;
    }

    response.numRowsAdded = rowCount - previousRowCount;
    this.emitEvent(response);
  },
};
