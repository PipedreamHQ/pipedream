const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.0.6",
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
    async takeSheetSnapshot() {
      // Initialize row counts (used to keep track of new rows)
      const sheetId = this.getSheetId();
      const worksheetIds = this.getWorksheetIds();
      const rowCounts = await this.google_sheets.getWorksheetRowCounts(sheetId);
      for (const worksheetCount of rowCounts) {
        if (!worksheetIds.includes(worksheetCount.sheetId.toString())) {
          continue;
        }

        this.db.set(
          `${worksheetCount.spreadsheetId}${worksheetCount.sheetId}`,
          worksheetCount.rows,
        );
      }
    },
  },
  async run(event) {
    let subscription = this.db.get("subscription");
    let channelID = this.db.get("channelID");
    let pageToken = this.db.get("pageToken");

    const driveId = this.getDriveId();

    // Component was invoked by timer
    if (event.interval_seconds) {
      // Assume subscription, channelID, and pageToken may all be undefined at this point
      // Handle their absence appropriately
      channelID = channelID || uuid();
      pageToken = pageToken || await this.google_sheets.getPageToken(driveId);

      const {
        expiration,
        resourceId,
      } = await this.google_sheets.checkResubscription(
        subscription,
        channelID,
        pageToken,
        this.http.endpoint,
        this.watchedDrive,
      );
      this.db.set("subscription", { expiration, resourceId });
      this.db.set("pageToken", pageToken);
      this.db.set("channelID", channelID);
      return;
    }

    const { headers } = event;
    if (!headers) return;

    if (!this.google_sheets.checkHeaders(headers, subscription, channelID)) {
      return;
    }

    const sheetId = this.getSheetId();
    const worksheetIds = this.getWorksheetIds();

    const { file, newPageToken } = await this.getModifiedSheet(
      pageToken,
      driveId,
      sheetId,
    );
    if (newPageToken) this.db.set("pageToken", newPageToken);

    if (!file) return;

    const spreadsheet = await this.google_sheets.getSpreadsheet(sheetId);
    for (const worksheet of spreadsheet.sheets) {
      const {
        sheetId: worksheetId,
        title: worksheetTitle,
      } = worksheet.properties;
      if (!worksheetIds.includes(worksheetId.toString())) {
        continue;
      }

      const oldRowCount = this.db.get(`${sheetId}${worksheetId}`);
      const rowCount = worksheet.data[0].rowData
        ? worksheet.data[0].rowData.length
        : 0;

      if (rowCount <= oldRowCount) continue;

      this.db.set(`${sheetId}${worksheetId}`, rowCount);

      const diff = rowCount - oldRowCount;
      const upperBound = rowCount;
      const lowerBound = upperBound - (diff - 1);
      const range = `${worksheetTitle}!${lowerBound}:${upperBound}`;
      const newRowValues = await this.google_sheets.getSpreadsheetValues(
        sheetId,
        range,
      );
      for (const [index, newRow] of newRowValues.values.entries()) {
        const rowNumber = lowerBound + index;
        this.$emit(
          { newRow, range, worksheet, rowNumber },
          this.getMeta(spreadsheet, worksheet, rowNumber)
        );
      }
    }
  },
};
