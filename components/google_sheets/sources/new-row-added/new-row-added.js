const google_sheets = require("../../google_sheets.app.js");
const google_drive = require("../../google_drive.app.js");
const { uuid } = require("uuidv4");

module.exports = {
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description:
    "Emits an event each time a row or rows are added to the bottom of a spreadsheet.",
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
    getMeta(spreadsheet, sheet, diff) {
      return {
        id: `${spreadsheet.spreadsheetId}${
          sheet.properties.sheetId
        }${Date.now()}`,
        summary: `${diff} rows added to ${spreadsheet.properties.title} - ${sheet.properties.title}`,
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

    let sheetIDs = this.sheetIDs || [];
    if (headers["x-goog-resource-state"] === "sync") {
      // initialize row counts
      if (sheetIDs.length === 0) {
        const sheets = (
          await this.google_drive.listSheets(
            this.drive === "myDrive" ? null : this.drive
          )
        ).options;
        for (const s of sheets) sheetIDs.push(s.value);
      }
      const rowCounts = await this.google_sheets.getRowCounts(sheetIDs);
      for (const sheetCount of rowCounts) {
        this.db.set(
          `${sheetCount.spreadsheetId}${sheetCount.sheetId}`,
          sheetCount.rows
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
      let spreadsheet = await this.google_sheets.getSpreadsheet(file.id);
      for (const sheet of spreadsheet.sheets) {
        let oldRowCount = this.db.get(
          `${spreadsheet.spreadsheetId}${sheet.properties.sheetId}`
        );
        let rowCount = sheet.properties.gridProperties.rowCount;
        if (oldRowCount && rowCount > oldRowCount) {
          let diff = rowCount - oldRowCount;
          this.$emit(sheet, this.getMeta(spreadsheet, sheet, diff));
        }
        this.db.set(
          `${spreadsheet.spreadsheetId}${sheet.properties.sheetId}`,
          rowCount
        );
      }
    }

    if (newPageToken) this.db.set("pageToken", newPageToken);
  },
};