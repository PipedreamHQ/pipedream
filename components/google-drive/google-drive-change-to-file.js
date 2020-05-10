const { google } = require("googleapis");
const get = require("lodash.get");

const googleDrive = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    file: {
      description: "The files you want to watch for changes",
      label: "Files",
      type: "string[]",
      optional: true,
    },
  },
  methods: {
    _tokens() {
      return {
        access_token: get(this, "$auth.oauth_access_token"),
      };
    },
    // Returns an authenticated drive object you can use to interact with the Drive API
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials(this._tokens());
      return google.drive({ version: "v3", auth });
    },
    // TODO: does this paginate and handle 429s correctly?
    async listFiles() {
      const drive = this.drive();
      const { files } = (await drive.files.list()).data;
      return files.map((file) => {
        return { label: file.name, value: file.id };
      });
    },
    async startNotifications(id, fileID, address) {
      // https://www.googleapis.com/drive/v3/files/fileId/watch
      const drive = this.drive();
      const resp = await drive.files.watch({
        fileID,
        resource: {
          id,
          type: "web_hook",
          address,
        },
      });
      console.log("Watch response: ", resp);

      return {
        expiration,
      };
    },
    async stopNotifications(channelID, fileID) {
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

const { v4: uuidv4 } = require("uuid");

module.exports = {
  name: "google-drive-change-to-file",
  version: "0.0.1",
  dedupe: "unique", // Dedupe events based on the incoming event ID
  props: {
    db: "$.service.db",
    googleDrive,
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
      // Called when a componenent is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      // TODO: test to make sure this is called when I update the files prop

      // TODO: update subscriptions on prop changes. Get the diff from the previous
      // set of saved props, activating new ones and stopping old ones.
      const currentlyWatchedFiles = this.db.get("currentlyWatchedFiles");

      // You can pass the same channel ID in watch requests for multiple files, so
      // our channel ID is fixed for this component to simplify the state we have to
      // keep track of.
      const channelID = this.db.get("channelID") || uuidv4();
      const subscriptions = this.db.get("subscriptions") || {};

      if (!this.files || !this.files.length) {
        // TODO: Handle the absence of a file ID (subscribe to all resources)
        console.log("NO FILE SPECIFIED");
      }
      for (const fileID of this.files) {
        const { expiration } = await this.googleDrive.startNotifications(
          channelID,
          fileID,
          this.http.endpoint
        );
        subscriptions[fileID] = expiration;
      }

      // Save metadata on the subscription so we can stop / renew later
      this.db.set("subscriptions", subscriptions);
      this.db.set("currentlyWatchedFiles", this.files);
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

      const fileIDs = this.db.get("fileIDs");
      for (const fileID of fileIDs) {
        await this.googleDrive.stopNotifications(channelID, fileID);
      }
    },
  },
  async run(event) {
    // TODO: Check the format of the event to see if this was triggered by the timer or webhook

    // TODO: handle x-goog-resource-state = sync

    // TODO: if cron, check to see if the channel is set to expire within the next day. Renew if so
    // Is the # of intervalSeconds present in the cron event? Use it to check if we're expiring
    // before the next run, and resubscribe
    const subscriptions = this.db.get("subscriptions") || {};
    for (const [fileID, expiration] of Object.entries(subscriptions)) {
    }

    // TODO: Validate incoming request is tied to our channel, and has the correct headers
    const channelID = this.db.get("channelID");

    // TODO: emit and set ID to the event ID from Google
  },
};
