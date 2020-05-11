const { google } = require("googleapis");
const get = require("lodash.get");

const googleDrive = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    files: {
      type: "string[]",
      description: "The files you want to watch for changes",
      label: "Files",
      optional: true,
      // TODO: handle pagination
      async options() {
        return await this.listFiles();
      },
    },
  },
  methods: {
    _tokens() {
      const access_token = get(this, "$auth.oauth_access_token");
      return {
        access_token,
      };
    },
    // returns a drive object authenticated with the user's access token
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials(this._tokens());
      const drive = google.drive({ version: "v3", auth });
      return drive;
    },
    // TODO: handle pagination
    async listFiles() {
      const drive = this.drive();
      const resp = await drive.files.list();
      console.log(`List files response: ${resp}`);
      const { files } = resp.data;
      return files.map((file) => {
        return { label: file.name, value: file.id };
      });
    },
    async watch(id, address, fileId) {
      // TODO: handle absence of fileId
      if (!fileId) {
        console.log("No fileId - subscribe to all changes");
        return { expiration: +new Date() };
      } else {
        // https://www.googleapis.com/drive/v3/files/fileId/watch
        const drive = this.drive();
        const { expiration, resourceId } = (
          await drive.files.watch({
            fileId,
            resource: {
              id,
              type: "web_hook",
              address,
            },
          })
        ).data;
        return {
          expiration: parseInt(expiration),
          resourceId,
        };
      }
    },
    async stopNotifications(channelID, fileID) {
      // TODO: if the file ID is missing, get all notifications
      // Make sure we store / pass the correct ID
      // See https://github.com/googleapis/google-api-nodejs-client/issues/627
      const params = { resource: { id: "...", resourceId: "..." } };
    },
  },
};

// This source processes changes to files in a user's Google Drive,
// implementing strategy suggested by the the Push Notifications API:
// https://developers.google.com/drive/api/v3/push .
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

const { uuid } = require("uuidv4");

module.exports = {
  name: "google-drive-change-to-file",
  version: "0.0.1",
  // Dedupe events based on the "x-goog-message-number" header, which always increments:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "greatest",
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 6,
      },
    },
    files: { propDefinition: [googleDrive, "files"] },
  },
  hooks: {
    async activate() {
      try {
        // Called when a componenent is created or updated. Handles all the logic
        // for starting and stopping watch notifications tied to the desired files.

        // TODO: test to make sure this is called when I update the files prop

        // You can pass the same channel ID in watch requests for multiple files, so
        // our channel ID is fixed for this component to simplify the state we have to
        // keep track of.
        const channelID = this.db.get("channelID") || uuid();

        let subscriptions = this.db.get("subscriptions") || {};
        const currentlyWatchedFiles = subscriptions
          ? Object.keys(subscriptions)
          : [];

        // TODO: update subscriptions on prop changes. Get the diff from the previous
        // set of saved props, activating new ones and stopping old ones.

        if (!this.files || !this.files.length) {
          // TODO: Handle the absence of a file ID (subscribe to all resources)
          // How to store the channel ID in this case?
          console.log("NO FILE SPECIFIED");
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
            subscriptions[fileID] = { expiration, resourceId };
          }
        }

        // Save metadata on the subscription so we can stop / renew later
        this.db.set("subscriptions", subscriptions);
        this.db.set("channelID", channelID);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    },
    // Need to handle updated logic,
    async deactivate() {
      // Stop notifications tied to the channel ID for this source
      const channelID = this.db.get("channelID");
      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel"
        );
        return;
      }

      if (!this.files || !this.files.length) {
        await this.googleDrive.stopNotifications(channelID);
      } else {
        for (const fileID of this.files) {
          await this.googleDrive.stopNotifications(channelID, fileID);
        }
      }
    },
  },
  async run(event) {
    try {
      console.log(event);
      // This method is polymorphic: it can be triggered as a cron job, to make sure we renew
      // watch requests for specific files, or via HTTP request (the change payloads from Google)

      // TIMER
      if ("interval_seconds" in event) {
        // TODO: if cron, check to see if the channel is set to expire within the next day. Renew if so
        // Is the # of interval_seconds present in the cron event? Use it to check if we're expiring
        // before the next run, and resubscribe
        const subscriptions = this.db.get("subscriptions") || {};
        for (const [fileID, expiration] of Object.entries(subscriptions)) {
        }

        return;
      }

      const { headers } = event;

      if (headers["x-goog-resource-state"] === "sync") {
        console.log("Sync notification, exiting early");
        return;
      }

      const channelID = this.db.get("channelID");
      const incomingChannelID = headers["x-goog-channel-id"];
      if (incomingChannelID !== channelID) {
        console.log(
          `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`
        );
      }

      if (
        !headers["x-goog-resource-state"] ||
        !headers["x-goog-resource-id"] ||
        !headers["x-goog-message-number"]
      ) {
        console.log(`Missing necessary headers: ${headers}`);
        return;
      }

      // TODO: emit and set ID to the event ID from Google
      this.$emit(event, {
        summary: `${headers["x-goog-resource-state"]} - ${headers["x-goog-resource-id"]}`,
        id: headers["x-goog-message-number"],
      });
      // TODO: emit fileID with payload
    } catch (err) {
      console.log(`Error in run: ${err}`);
    }
  },
};
