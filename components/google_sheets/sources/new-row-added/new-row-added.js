const common = require('../common');

module.exports = {
  ...common,
  key: 'google_sheets-new-row-added',
  name: 'New Row Added (Instant)',
  description:
    'Emits an event each time a row or rows are added to the bottom of a spreadsheet.',
  version: '0.0.13',
  dedupe: 'unique',
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        'sheetID',
        c => ({
          driveId: c.watchedDrive === 'myDrive' ? null : c.watchedDrive,
        }),
      ],
    },
    worksheetIDs: {
      propDefinition: [
        common.props.google_sheets,
        'worksheetIDs',
        c => ({sheetId: c.sheetID}),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(spreadsheet, worksheet, rowNumber) {
      const {sheetId: worksheetId} = worksheet;
      const {spreadsheetId: sheetId} = spreadsheet;
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
      // Temporary transformation to ensure the format of the data is the
      // correct one. This will be fixed in the UI and backend, so that the data
      // format is guaranteed to be the one indicated in the `type` field of the
      // user prop.
      return this.sheetID.toString();
    },
    getWorksheetIds() {
      // Temporary transformation to ensure the format of the data is the
      // correct one. This will be fixed in the UI and backend, so that the data
      // format is guaranteed to be the one indicated in the `type` field of the
      // user prop.
      return this.worksheetIDs.map(i => i.toString());
    },
    async getWorksheetLengthsById() {
      const sheetId = this.getSheetId();
      const worksheetIds = new Set(this.getWorksheetIds());
      const worksheetLengths = await this.google_sheets.getWorksheetLength(
        sheetId,
      );
      return worksheetLengths
        .map(worksheetLengthData => {
          const {worksheetId} = worksheetLengthData;
          return {
            ...worksheetLengthData,
            worksheetId: worksheetId.toString(),
          };
        })
        .filter(({worksheetId}) => worksheetIds.has(worksheetId))
        .reduce(
          (accum, {worksheetId, worksheetLength}) => ({
            ...accum,
            [worksheetId]: worksheetLength,
          }),
          {},
        );
    },
    async takeSheetSnapshot(offset = 0) {
      // Initialize row counts (used to keep track of new rows)
      const sheetId = this.getSheetId();
      const worksheetIds = this.getWorksheetIds();
      const worksheetRowCounts = await this.google_sheets.getWorksheetRowCounts(
        sheetId,
        worksheetIds,
      );
      for (const worksheetRowCount of worksheetRowCounts) {
        const {rowCount, worksheetId} = worksheetRowCount;
        const offsetRowCount = Math.max(rowCount - offset, 0);
        this.db.set(`${sheetId}${worksheetId}`, offsetRowCount);
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
          range,
        );

        const newRowCount = oldRowCount + newRowValues.values.length;
        if (newRowCount <= oldRowCount) continue;

        this.db.set(`${sheetId}${worksheetId}`, newRowCount);

        for (const [index, newRow] of newRowValues.values.entries()) {
          const rowNumber = lowerBound + index;
          this.$emit(
            {newRow, range, worksheet, rowNumber},
            this.getMeta(spreadsheet, worksheet, rowNumber),
          );
        }
      }
    },
  },
};
