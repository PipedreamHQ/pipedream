/**
 * This module implements logic common to the "New Worksheet" sources. To create
 * a source with this module, extend  {@linkcode ./http-based/base.mjs base.mjs}
 * or one of its "child" modules (`drive.mjs` or `sheet.mjs`).
 */
export default {
  hooks: {
    async deploy() {
      await this.processSpreadsheet({
        spreadsheetId: this.sheetID,
      });
    },
  },
  methods: {
    generateMeta(worksheet) {
      return {
        id: worksheet.properties.sheetId,
        summary: worksheet.properties.title,
        ts: Date.now(),
      };
    },
    /**
     * Temporary transformation to ensure the format of the data is the
     * correct one. This will be fixed in the UI and backend, so that the data
     * format is guaranteed to be the one indicated in the `type` field of the
     * user prop.
     */
    getSheetId() {
      return this.sheetID.toString();
    },
    _getWorksheetIds() {
      return this.db.get("worksheetIds");
    },
    _setWorksheetIds(worksheetIds) {
      this.db.set("worksheetIds", worksheetIds);
    },
    async processSpreadsheet({ spreadsheetId }) {
      const { sheets: worksheets } = await this.googleSheets.getSpreadsheet(
        spreadsheetId,
      );
      let worksheetIds = this._getWorksheetIds() || [];
      for (const worksheet of worksheets) {
        if (worksheetIds.includes(worksheet.properties.sheetId)) continue;
        worksheetIds.push(worksheet.properties.sheetId);
        const meta = this.generateMeta(worksheet);
        this.$emit(worksheet, meta);
      }
      this._setWorksheetIds(worksheetIds);
    },
    takeSheetSnapshot() {},
  },
};
