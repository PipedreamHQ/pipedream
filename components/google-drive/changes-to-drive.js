const axios = require("axios");
const { google } = require("googleapis");

const googleDrive = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    files: {
      type: "string[]",
      description:
        "The files you want to watch for changes. **Leave blank to watch for changes to all files**.",
      label: "Files",
      optional: true,
      async options({ page, prevContext }) {
        const { nextPageToken } = prevContext;
        return await this.listFiles(nextPageToken);
      },
    },
  },
  methods: {
    // Returns a drive object authenticated with the user's access token
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      const drive = google.drive({ version: "v3", auth });
      return drive;
    },
    // Google's push notifications provide a URL to the resource that changed,
    // which we can use to fetch the file's metadata
    async getFileMetadata(url) {
      return (
        await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          url,
        })
      ).data;
    },
    async getChanges(pageToken) {
      const { changes, newStartPageToken } = (
        await drive.changes.list({
          pageToken,
        })
      ).data;
      const changedFiles = changes.map((change) => change.file);
      return {
        changedFiles,
        newStartPageToken,
      };
    },
    async listFiles(pageToken) {
      const drive = this.drive();
      const resp = await drive.files.list({ pageToken });
      const { files, nextPageToken } = resp.data;
      const options = files.map((file) => {
        return { label: file.name, value: file.id };
      });
      return {
        options,
        context: { nextPageToken },
      };
    },
    _makeWatchRequestBody(id, address) {
      return {
        id, // the component-specific channel ID, a UUID
        type: "web_hook",
        address, // the component-specific HTTP endpoint
      };
    },
    async watchDrive(id, address, pageToken) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      // When watching for changes to an entire account, we must pass a pageToken,
      // which points to the moment in time we want to start watching for changes:
      // https://developers.google.com/drive/api/v3/manage-changes
      const { expiration, resourceId } = (
        await drive.changes.watch({
          pageToken,
          requestBody,
        })
      ).data;
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async watchFile(id, address, fileId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      let resp;
      if (!fileId) {
        resp = await drive.changes.watch({
          pageToken: startPageToken,
          requestBody,
        });
      } else {
        resp = await drive.files.watch({
          fileId,
          requestBody,
        });
      }
      const { expiration, resourceId } = resp.data;
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async stopNotifications(id, resourceId) {
      // id = channelID
      // See https://github.com/googleapis/google-api-nodejs-client/issues/627
      const drive = this.drive();
      const resp = drive.channels.stop({ resource: { id, resourceId } });
    },
  },
};

// This source processes changes to files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push .
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

const { uuid } = require("uuidv4");

module.exports = {
  name: "Google Drive - New, Modified, Removed Files",
  version: "0.0.1",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    files: { propDefinition: [googleDrive, "files"] },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasionaly renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 6,
      },
    },
  },
  hooks: {
    async activate() {
      // Called when a componenent is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      // You can pass the same channel ID in watch requests for multiple files, so
      // our channel ID is fixed for this component to simplify the state we have to
      // keep track of.
      const channelID = this.db.get("channelID") || uuid();

      // Subscriptions are keyed on Google's resourceID, "an opaque value that
      // identifies the watched resource". This header is included in request headers,
      // allowing us to look up the watched resource (specific file or all files).
      let subscriptions = this.db.get("subscriptions") || {};

      if (!this.files || !this.files.length) {
        const { startPageToken } = (
          await drive.changes.getStartPageToken({})
        ).data;
        const { expiration, resourceId } = await this.googleDrive.watchDrive(
          channelID,
          this.http.endpoint,
          startPageToken
        );
        // We use and increment as new changes arrive, in run()
        this.db.set("pageToken", startPageToken);
        console.log(
          `Finished watch request for all files, expiry: ${expiration}`
        );
        subscriptions[resourceId] = { expiration };
      } else {
        for (const fileID of this.files) {
          const { expiration, resourceId } = await this.googleDrive.watch(
            channelID,
            this.http.endpoint,
            fileID
          );
          console.log(
            `Finished watch request for file ${fileID}, expiry: ${expiration}`
          );
          // The fileID must be kept with the subscription metadata so
          // we can renew the watch request for this specific file
          // when it expires.
          subscriptions[resourceId] = { expiration, fileID };
        }
      }

      // Save metadata on the subscription so we can stop / renew later
      this.db.set("subscriptions", subscriptions);
      this.db.set("channelID", channelID);
    },
    async deactivate() {
      const channelID = this.db.get("channelID");
      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel"
        );
        return;
      }

      const subscriptions = this.db.get("subscriptions") || {};
      console.log("Subscriptions: ", subscriptions);
      for (const resourceId of Object.keys(subscriptions)) {
        await this.googleDrive.stopNotifications(channelID, resourceId);
      }

      // Reset DB state
      this.db.set("subscriptions", {});
      this.db.set("channelID", null);
    },
  },
  async run(event) {
    console.log(event);
    // This method is polymorphic: it can be triggered as a cron job, to make sure we renew
    // watch requests for specific files, or via HTTP request (the change payloads from Google)

    let subscriptions = this.db.get("subscriptions") || {};
    // Component was invoked by timer
    // TODO: set expiration to a low value, test this logic
    if ("interval_seconds" in event) {
      for (const [currentResourceId, metadata] of Object.entries(
        subscriptions
      )) {
        const { expiration, fileID } = metadata; // expiration is in epoch seconds
        // If the subscription for this resource will expire before the next run,
        // stop the existing subscription and renew
        if (expiration < +new Date() + event.interval_seconds) {
          console.log(
            `Notifications for resource ${currentResourceId} are expiring at ${expiration}. Renewing`
          );
          await this.googleDrive.stopNotifications(
            channelID,
            currentResourceId
          );
          const { expiration, resourceId } = await this.googleDrive.watch(
            channelID,
            this.http.endpoint,
            fileID
          );
          subscriptions[resourceId] = { expiration, fileID };
        }
      }

      this.db.set("subscriptions", subscriptions);
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

    const channelID = this.db.get("channelID");
    const incomingChannelID = headers["x-goog-channel-id"];
    if (incomingChannelID !== channelID) {
      console.log(
        `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`
      );
    }

    if (!(headers["x-goog-resource-id"] in subscriptions)) {
      console.log(
        `Resource ID of ${resourceId} not currently being tracked. Exiting`
      );
      return;
    }

    const { fileID } = subscriptions[headers["x-goog-resource-id"]];
    // When the user isn't watching a specific set of files, and watching for
    // changes to ALL files in a drive, "x-goog-resource-uri" points to a changes URI
    // that allows us to retrieve all changes since a given page token
    // https://developers.google.com/drive/api/v3/manage-changes
    if (!fileID) {
      const {} = await this.googleDrive.getChanges(pageToken);
    } else {
      const file = await this.googleDrive.getFileMetadata(
        headers["x-goog-resource-uri"]
      );
      const eventToEmit = {
        file,
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };

      this.$emit(eventToEmit, {
        summary: `${headers["x-goog-resource-state"].toUpperCase()} - ${
          file.name
        }`,
        id: headers["x-goog-message-number"],
      });
    }
  },
};
