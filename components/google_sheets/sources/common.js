const { v4: uuid } = require("uuid");
const google_sheets = require("../google_sheets.app");

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
        intervalSeconds: 60 * 60 * 6,
      },
    },
    watchedDrive: { propDefinition: [google_sheets, "watchedDrive"] },
  },
  hooks: {
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
    getDriveId() {
      return this.watchedDrive === "myDrive" ? null : this.watchedDrive;
    },
    getSheetId() {
      throw new Error("getSheetId is not implemented");
    },
    getWorksheetIds() {
      throw new Error("getWorksheetIds is not implemented");
    },
    takeSheetSnapshot() {
      throw new Error("takeSheetSnapshot is not implemented");
    },
  },
};
