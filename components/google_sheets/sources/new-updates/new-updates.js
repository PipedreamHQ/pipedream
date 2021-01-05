const google_sheets = require("../../google_sheets.app.js");
const google_drive = require("../../google_drive.app.js");
const { uuid } = require("uuidv4");

module.exports = {
  key: "google_sheets-new-updates",
  name: "New Updates (Instant)",
  description:
    "Emits an event each time a row or cell is updated in a spreadsheet.",
  version: "0.0.4",
  dedupe: "unique",
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

      // initialize sheet values
      const sheetValues = await this.google_sheets.getSheetValues(this.sheetID);
      for (const sheetVal of sheetValues) {
        this.db.set(
          `${sheetVal.spreadsheetId}${sheetVal.sheetId}`,
          sheetVal.values
        );
      }
    },
    async deactivate() {
      const channelID = this.db.get("channelID");
      const subscription = this.db.get("subscription");

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

      if (!subscription || !subscription.resourceId) {
        console.log(
          "No resource ID found, cannot stop notifications for non-existent resource"
        );
        return;
      }

      await this.google_drive.stopNotifications(
        channelID,
        subscription.resourceId
      );
    },
  },
  methods: {
    getMeta(spreadsheet, worksheet, changes) {
      return {
        id: `${spreadsheet.spreadsheetId}${
          worksheet.properties.sheetId
        }${JSON.stringify(changes)}`,
        summary: `${spreadsheet.properties.title} - ${worksheet.properties.title}`,
        ts: Date.now(),
      };
    },
    getChanges(colCount, newValues, oldValues, changes, i) {
      // loop through comparing the values of each cell
      for (let j = 0; j < colCount; j++) {
        let newValue =
          typeof newValues[i] !== "undefined" &&
          typeof newValues[i][j] !== "undefined"
            ? newValues[i][j]
            : "";
        let oldValue =
          typeof oldValues[i] !== "undefined" &&
          typeof oldValues[i][j] !== "undefined"
            ? oldValues[i][j]
            : "";
        if (newValue !== oldValue) {
          changes.push({
            cell: `${String.fromCharCode(j + 65)}:${i + 1}`,
            previous_value: oldValue,
            new_value: newValue,
          });
        }
      }
      return changes;
    },
    getRowCount(newValues, oldValues) {
      // set rowCount to the larger of previous rows or current rows
      return (rowCount =
        newValues.length > oldValues.length
          ? newValues.length
          : oldValues.length);
    },
    getColCount(newValues, oldValues, i) {
      let colCount = 0;
      // set colCount to the larger of previous columns or current columns
      if (
        typeof newValues[i] === "undefined" &&
        typeof oldValues[i] !== "undefined"
      )
        colCount = oldValues[i].length;
      else if (
        typeof oldValues[i] === "undefined" &&
        typeof newValues[i] !== "undefined"
      )
        colCount = newValues[i].length;
      else
        colCount =
          newValues[i].length > oldValues[i].length
            ? newValues[i].length
            : oldValues.length;
      return colCount;
    },
    async getValues(spreadsheet, worksheet, file) {
      const oldValues =
        this.db.get(
          `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`
        ) || null;
      const currentValues = await this.google_sheets.getSpreadsheetValues(
        file.id,
        worksheet.properties.title
      );
      return { oldValues, currentValues };
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
      const { oldValues, currentValues } = await this.getValues(
        spreadsheet,
        worksheet,
        file
      );
      const newValues = currentValues.values || [];
      let changes = [];
      // check if there are differences in the spreadsheet values
      if (
        oldValues &&
        JSON.stringify(oldValues) !== JSON.stringify(currentValues.values)
      ) {
        let rowCount = this.getRowCount(newValues, oldValues);
        for (let i = 0; i < rowCount; i++) {
          let colCount = this.getColCount(newValues, oldValues, i);
          changes = this.getChanges(colCount, newValues, oldValues, changes, i);
        }
        this.$emit(
          { worksheet, currentValues, changes },
          this.getMeta(spreadsheet, worksheet, changes)
        );
      }
      this.db.set(
        `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`,
        newValues || []
      );
    }
  },
};
