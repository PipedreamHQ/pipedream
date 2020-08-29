// This source processes changes to any files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push and here:
// https://developers.google.com/drive/api/v3/manage-changes
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

const { uuid } = require("uuidv4");
const includes = require("lodash.includes");
const googleDrive = require("https://github.com/PipedreamHQ/pipedream/components/google-drive/google-drive.app.js");

module.exports = {
  name: "New or Modified Files in Drive",
  description:
    "Emits a new event any time any file in your linked Google Drive is added, modified, or deleted",
  version: "0.0.3",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    drive: { propDefinition: [googleDrive, "watchedDrive"] },
    updateTypes: { propDefinition: [googleDrive, "updateTypes"] },
    watchForPropertiesChanges: {
      propDefinition: [googleDrive, "watchForPropertiesChanges"],
    },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasionaly renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 30,
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

    // Otherwise, component was invoked by an HTTP request
    this.http.respond({
      status: 200,
    });

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

    if (!includes(this.updateTypes, headers["x-goog-resource-state"])) {
      console.log(
        `Update type ${headers["x-goog-resource-state"]} not in list of updates to watch: `,
        this.updateTypes
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

    for (const file of changedFiles) {
      console.log(file);
      const eventToEmit = {
        file,
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };

      this.$emit(eventToEmit, {
        summary: file.name,
        id: headers["x-goog-message-number"],
      });
    }
  },
};
