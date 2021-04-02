const { v4: uuid } = require("uuid");
const google_sheets = require("../google_sheets.app");

/**
 * The number of events that will be automatically sent whenever the event
 * source is setup and deployed for the first time.
 *
 * Note that the event source could send less initial events than this if the
 * associated worksheets do not contain enough data.
 */
const INITIAL_EVENT_COUNT = 10;

module.exports = {
  props: {
    google_sheets,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasionally renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 30, // 30 minutes
      },
    },
    watchedDrive: { propDefinition: [google_sheets, "watchedDrive"] },
  },
  hooks: {
    async deploy() {
      await this.takeSheetSnapshot(INITIAL_EVENT_COUNT);

      const sheetId = this.getSheetId();
      const spreadsheet = await this.google_sheets.getSpreadsheet(sheetId);
      await this.processSpreadsheet(spreadsheet);
    },
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      const channelID = this.db.get("channelID") || uuid();
      const driveId = this.getDriveId();

      const startPageToken = await this.google_sheets.getPageToken(driveId);
      const { expiration, resourceId } = await this.google_sheets.watchDrive(
        channelID,
        this.http.endpoint,
        startPageToken,
        driveId,
      );

      // We use and increment the pageToken as new changes arrive, in run()
      this.db.set("pageToken", startPageToken);

      // Save metadata on the subscription so we can stop / renew later
      // Subscriptions are tied to Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request headers
      this.db.set("subscription", { resourceId, expiration });
      this.db.set("channelID", channelID);

      await this.takeSheetSnapshot();
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

      await this.google_sheets.stopNotifications(
        channelID,
        subscription.resourceId
      );
    },
  },
  methods: {
    async getModifiedSheet(pageToken, driveId, sheetID) {
      const {
        changedFiles,
        newStartPageToken,
      } = await this.google_sheets.getChanges(pageToken, driveId);
      const file = changedFiles
        .filter(file => file.mimeType.includes("spreadsheet"))
        .filter(file => sheetID === file.id)
        .shift();
      return {
        file,
        pageToken: newStartPageToken,
      };
    },
    async getSpreadsheetToProcess(event) {
      const { headers } = event;
      const subscription = this.db.get("subscription");
      const channelID = this.db.get("channelID");
      const pageToken = this.db.get("pageToken");

      if (!this.google_sheets.checkHeaders(headers, subscription, channelID)) {
        return;
      }

      const driveId = this.getDriveId();
      const sheetId = this.getSheetId();
      const { file, newPageToken } = await this.getModifiedSheet(
        pageToken,
        driveId,
        sheetId,
      );
      if (newPageToken) this.db.set("pageToken", newPageToken);

      if (!file) {
        console.log("No sheets were modified");
        return;
      }

      return this.google_sheets.getSpreadsheet(sheetId);
    },
    getDriveId() {
      return this.watchedDrive === "myDrive" ? null : this.watchedDrive;
    },
    getSheetId() {
      throw new Error("getSheetId is not implemented");
    },
    getWorksheetIds() {
      throw new Error("getWorksheetIds is not implemented");
    },
    isEventRelevant(event) {
      const { headers } = event;
      return headers["x-goog-resource-state"] !== "sync";
    },
    isWorksheetRelevant(worksheetId) {
      const worksheetIds = this.getWorksheetIds();
      return worksheetIds.includes(worksheetId.toString());
    },
    processSpreadsheet() {
      throw new Error("processEvent is not implemented");
    },
    async renewSubscription() {
      const driveId = this.getDriveId();

      // Assume subscription, channelID, and pageToken may all be undefined at
      // this point Handle their absence appropriately.
      const subscription = this.db.get("subscription");
      const channelID = this.db.get("channelID") || uuid();
      const pageToken = (
        this.db.get("pageToken") ||
        await this.google_sheets.getPageToken(driveId)
      );

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
    },
    /**
     * This method scans the worksheets indicated by the user to retrieve the
     * current row count of each one, and cache those values.
     *
     * @param {number} [offset=0] When present, the row count that gets cached
     * will be reduced by this amount (useful for example to force an event
     * source to interpret the last rows as new).
     */
    takeSheetSnapshot() {
      throw new Error("takeSheetSnapshot is not implemented");
    },
  },
  async run(event) {
    if (event.interval_seconds) {
      // Component was invoked by timer
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    const spreadsheet = await this.getSpreadsheetToProcess(event);
    if (!spreadsheet) {
      const sheetId = this.getSheetId();
      console.log(`Spreadsheet "${sheetId}" was not modified. Skipping event`);
      return;
    }

    return this.processSpreadsheet(spreadsheet);
  },
};
