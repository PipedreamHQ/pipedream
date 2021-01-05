const google_sheets = require("../../google_sheets.app.js");
const google_drive = require("../../google_drive.app.js");
const { uuid } = require("uuidv4");

module.exports = {
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.0.4",
  props: {
    google_sheets,
    google_drive,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasionaly renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 6,
      },
    },
    drive: { propDefinition: [google_drive, "watchedDrive"] },
    sheetID: {
      type: "string",
      label: "Spreadsheet to watch for changes",
      async options({ page, prevContext }) {
        const { nextPageToken } = prevContext;
        return await this.google_drive.listSheets(
          this.drive === "myDrive" ? null : this.drive,
          nextPageToken
        );
      },
    },
    worksheetIDs: {
      type: "string[]",
      label: "Worksheets to watch for changes",
      async options() {
        const options = [];
        const worksheets = (
          await this.google_sheets.getSpreadsheet(this.sheetID)
        ).sheets;
        for (const worksheet of worksheets) {
          options.push({
            label: worksheet.properties.title,
            value: worksheet.properties.sheetId,
          });
        }
        return options;
      },
    },
  },
  hooks: {
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      const channelID = this.db.get("channelID") || uuid();

      const startPageToken = await this.google_drive.getPageToken(
        this.drive === "myDrive" ? null : this.drive
      );
      const { expiration, resourceId } = await this.google_drive.watchDrive(
        channelID,
        this.http.endpoint,
        startPageToken,
        this.drive === "myDrive" ? null : this.drive
      );
      // We use and increment the pageToken as new changes arrive, in run()
      this.db.set("pageToken", startPageToken);

      // Save metadata on the subscription so we can stop / renew later
      // Subscriptions are tied to Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request headers
      this.db.set("subscription", { resourceId, expiration });
      this.db.set("channelID", channelID);

      // Initialize row counts (used to keep track of new rows)
      const rowCounts = await this.google_sheets.getWorksheetRowCounts(
        this.sheetID
      );
      for (const worksheetCount of rowCounts) {
        if (
          this.worksheetIDs.length > 0 &&
          !this.worksheetIDs.includes(worksheetCount.sheetId.toString())
        ) {
          continue;
        }
        this.db.set(
          `${worksheetCount.spreadsheetId}${worksheetCount.sheetId}`,
          worksheetCount.rows
        );
      }
    },
    async deactivate() {
      const channelID = this.db.get("channelID");
      const { resourceId } = this.db.get("subscription");

      // Reset DB state before anything else
      this.db.set("subscription", null);
      this.db.set("channelID", null);
      this.db.set("pageToken", null);

      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel"
        );
        return;
      }
      if (!resourceId) {
        console.log(
          "No resource ID found, cannot stop notifications for non-existent resource"
        );
        return;
      }
      await this.google_drive.stopNotifications(channelID, resourceId);
    },
  },
  methods: {
    getMeta(spreadsheet, worksheet, data) {
      return {
        id: `${spreadsheet.spreadsheetId}${
          worksheet.properties.sheetId
        }${Date.now()}`,
        summary: data.join(", "),
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    let subscription = this.db.get("subscription");
    const channelID = this.db.get("channelID");
    const pageToken = this.db.get("pageToken");

    // Component was invoked by timer
    if (event.interval_seconds) {
      const {
        expiration,
        resourceId,
      } = await this.google_drive.checkResubscription(
        subscription,
        channelID,
        pageToken,
        this.http.endpoint,
        this.drive
      );
      this.db.set("subscription", { expiration, resourceId });
      return;
    }

    const { headers } = event;
    if (!headers) return;

    if (!this.google_drive.checkHeaders(headers, subscription, channelID)) {
      return;
    }

    const { file, newPageToken } = await this.google_drive.getModifiedSheet(
      pageToken,
      this.drive === "myDrive" ? null : this.drive,
      this.sheetID
    );
    if (newPageToken) this.db.set("pageToken", newPageToken);

    if (!file) return;

    const spreadsheet = await this.google_sheets.getSpreadsheet(file.id);
    for (const worksheet of spreadsheet.sheets) {
      if (
        this.worksheetIDs.length > 0 &&
        !this.worksheetIDs.includes(worksheet.properties.sheetId.toString())
      ) {
        continue;
      }
      let oldRowCount = this.db.get(
        `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`
      );
      let rowCount = worksheet.data[0].rowData
        ? worksheet.data[0].rowData.length
        : 0;
      if (rowCount <= oldRowCount) continue;

      let diff = rowCount - oldRowCount;
      let range = `${worksheet.properties.title}!${
        rowCount - (diff - 1)
      }:${rowCount}`;
      let newRowValues = await this.google_sheets.getSpreadsheetValues(
        spreadsheet.spreadsheetId,
        range
      );
      for (const newRow of newRowValues.values) {
        this.$emit(
          { newRow, range, worksheet },
          this.getMeta(spreadsheet, worksheet, newRow)
        );
      }

      this.db.set(
        `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`,
        rowCount
      );
    }
  },
};
