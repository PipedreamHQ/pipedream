const { uuid } = require("uuidv4");
const googleDrive = require("../../google_drive.app.js");

module.exports = {
  key: "google_drive-new-files-instant",
  name: "New Files (Instant)",
  description:
    "Emits a new event any time a new file is added in your linked Google Drive",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    drive: { propDefinition: [googleDrive, "watchedDrive"] },
    folders: {
      type: "string[]",
      label: "Folders",
      description: "The folders you want to watch for changes.",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        let results;
        if (this.drive === "myDrive") {
          results = await this.googleDrive.listFiles({
            pageToken: nextPageToken,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        } else {
          results = await this.googleDrive.listFiles({
            pageToken: nextPageToken,
            corpora: "drive",
            driveId: this.drive,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        }
        return results;
      },
    },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasional renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 24,
      },
    },
  },
  hooks: {
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      const channelID = this.db.get("channelID") || uuid();

      const startPageToken = await this.googleDrive.getPageToken();
      const { expiration, resourceId } = await this.googleDrive.watchDrive(
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

      await this.googleDrive.stopNotifications(channelID, resourceId);
    },
  },
  async run(event) {
    // This function is polymorphic: it can be triggered as a cron job, to make sure we renew
    // watch requests for specific files, or via HTTP request (the change payloads from Google)

    let subscription = this.db.get("subscription");
    const channelID = this.db.get("channelID");
    const pageToken = this.db.get("pageToken");

    // Component was invoked by timer
    if (event.interval_seconds) {
      if (!subscription || !subscription.resourceId) {
        return;
      }
      console.log(
        `Checking for resubscription on resource ${subscription.resourceId}`
      );
      // If the subscription for this resource will expire before the next run,
      // stop the existing subscription and renew. Expiration is in ms.
      if (
        subscription.expiration <
        +new Date() + event.interval_seconds * 1000
      ) {
        console.log(
          `Notifications for resource ${subscription.resourceId} are expiring at ${subscription.expiration}. Renewing`
        );
        await this.googleDrive.stopNotifications(
          channelID,
          subscription.resourceId
        );
        const { expiration, resourceId } = await this.googleDrive.watchDrive(
          channelID,
          this.http.endpoint,
          pageToken,
          this.drive === "myDrive" ? null : this.drive
        );
        this.db.set("subscription", { expiration, resourceId });
      }
      return;
    }

    const { headers } = event;

    if (headers["x-goog-resource-state"] === "sync") {
      console.log("Sync notification, exiting early");
      return;
    }

    if (
      !headers["x-goog-resource-state"] ||
      !headers["x-goog-resource-id"] ||
      !headers["x-goog-resource-uri"] ||
      !headers["x-goog-message-number"]
    ) {
      console.log("Request missing necessary headers: ", headers);
      return;
    }

    const incomingChannelID = headers["x-goog-channel-id"];
    if (incomingChannelID !== channelID) {
      console.log(
        `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`
      );
      return;
    }

    if (headers["x-goog-resource-id"] !== subscription.resourceId) {
      console.log(
        `Resource ID of ${resourceId} not currently being tracked. Exiting`
      );
      return;
    }

    // We observed false positives where a single change to a document would trigger two changes:
    // one to "properties" and another to "content,properties". But changes to properties
    // alone are legitimate, most users just won't want this source to emit in those cases.
    // If x-goog-changed is _only_ set to "properties", only move on if the user set the prop
    if (
      !this.watchForPropertiesChanges &&
      headers["x-goog-changed"] === "properties"
    ) {
      console.log(
        "Change to properties only, which this component is set to ignore. Exiting"
      );
      return;
    }

    const {
      changedFiles,
      newStartPageToken,
    } = await this.googleDrive.getChanges(
      pageToken,
      this.drive === "myDrive" ? null : this.drive
    );

    this.db.set("pageToken", newStartPageToken);

    // only get files created since the last logged file creation or within the last five minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    const lastFileCreatedTime =
      new Date(this.db.get("lastFileCreatedTime")) || fiveMinutesAgo;
    let maxCreatedTime = lastFileCreatedTime;
    let inFolder = false;
    for (const file of changedFiles) {
      const fileInfo = await this.googleDrive.getFile(file.id);
      if (this.folders.length === 0) inFolder = true;
      else {
        for (const folder of fileInfo.parents) {
          if (this.folders.includes(folder)) inFolder = true;
        }
      }
      const createdTime = new Date(fileInfo.createdTime);
      if (createdTime.getTime() > lastFileCreatedTime.getTime() && inFolder) {
        this.$emit(fileInfo, {
          summary: `New File ID: ${file.id}`,
          id: file.id,
          ts: createdTime.getTime(),
        });
      }
      if (createdTime.getTime() > maxCreatedTime.getTime())
        maxCreatedTime = createdTime;
    }

    this.db.set("lastFileCreatedTime", maxCreatedTime);
  },
};