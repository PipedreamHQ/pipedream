const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.0.9",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        "sheetID",
        (c) => ({
          watchedDrive: c.watchedDrive === "myDrive" ? null : c.watchedDrive,
        }),
      ],
    },
    worksheetIDs: {
      propDefinition: [
        common.props.google_sheets,
        "worksheetIDs",
        (c) => ({ sheetId: c.sheetID }),
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
    async getWorksheetLengthsById() {
      const sheetId = this.getSheetId();
      const worksheetIds = new Set(this.getWorksheetIds());
      const worksheetLengths = await this.google_sheets.getWorksheetLength(
        sheetId
      );
      return worksheetLengths
        .map((worksheetLengthData) => {
          const { worksheetId } = worksheetLengthData;
          return {
            ...worksheetLengthData,
            worksheetId: worksheetId.toString(),
          };
        })
        .filter(({ worksheetId }) => worksheetIds.has(worksheetId))
        .reduce(
          (accum, { worksheetId, worksheetLength }) => ({
            ...accum,
            [worksheetId]: worksheetLength,
          }),
          {}
        );
    },
    async takeSheetSnapshot() {
      // Initialize row counts (used to keep track of new rows)
      const sheetId = this.getSheetId();
      const worksheetIds = this.getWorksheetIds();
      const worksheetRowCounts = await this.google_sheets.getWorksheetRowCounts(
        sheetId,
        worksheetIds
      );
      for (const worksheetRowCount of worksheetRowCounts) {
        const { rowCount, worksheetId } = worksheetRowCount;
        this.db.set(`${sheetId}${worksheetId}`, rowCount);
      }
    },
    async processSpreadsheet(spreadsheet) {
      const sheetId = this.getSheetId();
      const worksheetLengthsById = await this.getWorksheetLengthsById();

      for (const worksheet of spreadsheet.sheets) {
        const {
          sheetId: worksheetId,
          title: worksheetTitle,
        } = worksheet.properties;
        if (!this.isWorksheetRelevant(worksheetId)) {
          continue;
        }

        const oldRowCount = this.db.get(`${sheetId}${worksheetId}`);
        const worksheetLength = worksheetLengthsById[worksheetId];
        const lowerBound = oldRowCount + 1;
        const upperBound = worksheetLength;
        const range = `${worksheetTitle}!${lowerBound}:${upperBound}`;
        const newRowValues = await this.google_sheets.getSpreadsheetValues(
          sheetId,
          range
        );

        const newRowCount = oldRowCount + newRowValues.values.length;
        if (newRowCount <= oldRowCount) continue;

        this.db.set(`${sheetId}${worksheetId}`, newRowCount);

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
