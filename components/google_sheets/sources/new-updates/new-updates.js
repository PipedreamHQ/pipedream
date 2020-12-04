const google_sheets = require("../../google_sheets.app.js");
const google_drive = require("../../google_drive.app.js");
const { uuid } = require("uuidv4");

module.exports = {
  key: "google_sheets-new-updates",
  name: "New Updates (Instant)",
  description:
    "Emits an event each time a row or cell is updated in a spreadsheet.",
  version: "0.0.1",
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
        intervalSeconds: 60 * 30,
      },
    },
    drive: { propDefinition: [google_drive, "watchedDrive"] },
    sheetIDs: {
      type: "string[]",
      label: "Sheets to watch for changes",
      optional: true,
      async options({ page, prevContext }) {
        const { nextPageToken } = prevContext;
        return await this.google_drive.listSheets(
          this.drive === "myDrive" ? null : this.drive,
          nextPageToken
        );
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
    getMeta(spreadsheet, sheet) {
      return {
        id: `${spreadsheet.spreadsheetId}${
          sheet.properties.sheetId
        }${Date.now()}`,
        summary: `${spreadsheet.properties.title} - ${sheet.properties.title}`,
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
          if (typeof changes[`row ${i + 1}`] === "undefined")
            changes[`row ${i + 1}`] = [];
          changes[`row ${i + 1}`].push({
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
      return rowCount =
        newValues.length > oldValues.length
          ? newValues.length
          : oldValues.length;
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
    async getValues(spreadsheet, sheet, file) {
      const oldValues =
        this.db.get(
          `${spreadsheet.spreadsheetId}${sheet.properties.sheetId}`
        ) || null;  
      const currentValues = await this.google_sheets.getSpreadsheetValues(
        file.id,
        sheet.properties.title
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

    let sheetIDs = this.sheetIDs || [];
    if (headers["x-goog-resource-state"] === "sync") {
      // initialize sheet values
      if (sheetIDs.length === 0) {
        const sheets = (
          await this.google_drive.listSheets(
            this.drive === "myDrive" ? null : this.drive
          )
        ).options;
        for (const s of sheets) sheetIDs.push(s.value);
      }
      const sheetValues = await this.google_sheets.getSheetValues(sheetIDs);
      for (const sheetVal of sheetValues) {
        this.db.set(
          `${sheetVal.spreadsheetId}${sheetVal.sheetId}`,
          sheetVal.values
        );
      }
    } else if (
      !this.google_drive.checkHeaders(headers, subscription, channelID)
    ) {
      return;
    }

    const { files, newPageToken } = await this.google_drive.getModifiedSheets(
      pageToken,
      this.drive === "myDrive" ? null : this.drive,
      sheetIDs
    );
    for (const file of files) {
      const spreadsheet = await this.google_sheets.getSpreadsheet(file.id);
      for (const sheet of spreadsheet.sheets) {
        const { oldValues, currentValues } = await this.getValues(spreadsheet, sheet, file);
        const newValues = currentValues.values || [];
        let changes = {};
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
            { sheet, currentValues, changes },
            this.getMeta(spreadsheet, sheet, changes)
          );
        }
        this.db.set(
          `${spreadsheet.spreadsheetId}${sheet.properties.sheetId}`,
          newValues || []
        );
      }
    }
    if (newPageToken) this.db.set("pageToken", newPageToken);
  }, 
};