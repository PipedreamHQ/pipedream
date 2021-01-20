const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.0.7",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        "sheetID",
        c => ({
          watchedDrive: c.watchedDrive === "myDrive" ? null : c.watchedDrive,
        }),
      ],
    },
    worksheetIDs: {
      propDefinition: [
        common.props.google_sheets,
        "worksheetIDs",
        c => ({ sheetId: c.sheetID }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(spreadsheet, worksheet, rowNumber) {
      const { sheetId: worksheetId } = worksheet;
      const { spreadsheetId: sheetId } = spreadsheet;
      const ts = Date.now();
      const id = `${sheetId}${worksheetId}${rowNumber}${ts}`;
      const summary = `New row #${rowNumber}`;
      return {
        id,
        summary,
        ts,
      };
    },
    getSheetId() {
      return this.sheetID;
    },
    getWorksheetIds() {
      return this.worksheetIDs;
    },
    async getRowCountsByWorksheetId() {
      const sheetId = this.getSheetId();
      const worksheetIds = new Set(this.getWorksheetIds());
      const rowCounts = await this.google_sheets.getWorksheetRowCounts(sheetId);
      return rowCounts
        .map((rowCountData) => {
          const { sheetId } = rowCountData;
          const worksheetId = sheetId.toString();
          return {
            ...rowCountData,
            worksheetId,
          };
        })
        .filter(({ worksheetId }) => worksheetIds.has(worksheetId))
        .reduce((accum, {
          worksheetId,
          rowCount,
        }) => ({
          ...accum,
          [worksheetId]: rowCount,
        }), {});
    },
    async takeSheetSnapshot() {
      // Initialize row counts (used to keep track of new rows)
      const sheetId = this.getSheetId();
      const rowCounts = await this.google_sheets.getWorksheetRowCounts(sheetId);
      for (const worksheetCount of rowCounts) {
        if (!this.isWorksheetRelevant(worksheetCount.sheetId)) {
          continue;
        }

        this.db.set(
          `${worksheetCount.spreadsheetId}${worksheetCount.sheetId}`,
          worksheetCount.rowCount,
        );
      }
    },
    async processSpreadsheet(spreadsheet) {
      const sheetId = this.getSheetId();
      const rowCountsByWorksheetId = await this.getRowCountsByWorksheetId();

      for (const worksheet of spreadsheet.sheets) {
        const {
          sheetId: worksheetId,
          title: worksheetTitle,
        } = worksheet.properties;
        if (!this.isWorksheetRelevant(worksheetId)) {
          continue;
        }

        const oldRowCount = this.db.get(`${sheetId}${worksheetId}`);
        const rowCount = rowCountsByWorksheetId[worksheetId];
        if (rowCount <= oldRowCount) continue;

        this.db.set(`${sheetId}${worksheetId}`, rowCount);

        const diff = rowCount - oldRowCount;
        const upperBound = rowCount;
        const lowerBound = upperBound - (diff - 1);
        const range = `${worksheetTitle}!${lowerBound}:${upperBound}`;
        const newRowValues = await this.google_sheets.getSpreadsheetValues(sheetId, range);
        for (const [index, newRow] of newRowValues.values.entries()) {
          const rowNumber = lowerBound + index;
          this.$emit(
            { newRow, range, worksheet, rowNumber },
            this.getMeta(spreadsheet, worksheet, rowNumber)
          );
        }
      }
    },
  },
};
