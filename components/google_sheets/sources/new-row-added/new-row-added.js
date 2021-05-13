const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.0.14",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        "sheetID",
        (c) => ({
          driveId: c.watchedDrive === "myDrive" ? null : c.watchedDrive,
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
      const summary = `New row #${rowNumber} in ${worksheet.properties.title}`;
      return {
        id,
        summary,
        ts,
      };
    },
    _getRowCount(id) {
      return this.db.get(id);
    },
    _setRowCount(id, rowCount) {
      this.db.set(id, rowCount);
    },
    async getWorksheetLengthsById() {
      const sheetId = this.getSheetId();
      const relevantWorksheets =
        this.getWorksheetIds().length === 0
          ? await this.getAllWorksheetIds(sheetId)
          : this.getWorksheetIds();
      const worksheetIds = new Set(relevantWorksheets);
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
    /**
     * Initialize row counts (used to keep track of new rows)
     */
    async takeSheetSnapshot(offset = 0) {
      const sheetId = this.getSheetId();
      const worksheetIds =
        this.getWorksheetIds().length === 0
          ? await this.getAllWorksheetIds(sheetId)
          : this.getWorksheetIds();
      const worksheetRowCounts = await this.google_sheets.getWorksheetRowCounts(
        sheetId,
        worksheetIds
      );
      for (const worksheetRowCount of worksheetRowCounts) {
        const { rowCount, worksheetId } = worksheetRowCount;
        const offsetRowCount = Math.max(rowCount - offset, 0);
        this._setRowCount(`${sheetId}${worksheetId}`, offsetRowCount);
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
        if (
          this.worksheetIDs.length &&
          !this.isWorksheetRelevant(worksheetId)
        ) {
          continue;
        }

        const oldRowCount = this._getRowCount(`${sheetId}${worksheetId}`);
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

        this._setRowCount(`${sheetId}${worksheetId}`, newRowCount);

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