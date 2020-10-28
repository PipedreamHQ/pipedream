const axios = require("axios");
const { google } = require("googleapis");

const GOOGLE_DRIVE_UPDATE_TYPES = [
  "sync",
  "remove",
  "update",
  "trash",
  "untrash",
  "change",
];

module.exports = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    watchedDrive: {
      type: "string",
      label: "Drive",
      description: "The drive you want to watch for changes",
      async options({ page, prevContext }) {
        const { nextPageToken } = prevContext;
        return await this.listDrives(nextPageToken);
      },
    },
    updateTypes: {
      type: "string[]",
      label: "Types of updates",
      description:
        "The types of updates you want to watch for on these files. [See Google's docs](https://developers.google.com/drive/api/v3/push#understanding-drive-api-notification-events).",
      // Everything from this doc except for "add", which is irrelevant
      // since the files already exists:
      // https://developers.google.com/drive/api/v3/push#understanding-drive-api-notification-events
      default: GOOGLE_DRIVE_UPDATE_TYPES,
      options: GOOGLE_DRIVE_UPDATE_TYPES,
    },
    watchForPropertiesChanges: {
      type: "boolean",
      label: "Watch for changes to file properties",
      description:
        "Watch for changes to [file properties](https://developers.google.com/drive/api/v3/properties) in addition to changes to content. **Defaults to `false`, watching for only changes to content**.",
      optional: true,
      default: false,
    },
  },
  methods: {
    // Returns a drive object authenticated with the user's access token
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      return google.drive({ version: "v3", auth });
    },
    // Google's push notifications provide a URL to the resource that changed,
    // which we can use to fetch the file's metadata. So we use axios here
    // (vs. the Node client) to get that.
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
    async getChanges(pageToken, driveId) {
      const drive = this.drive();
      // As with many of the methods for Google Drive, we must
      // pass a request of a different shape when we're requesting
      // changes for My Drive (null driveId) vs. a shared drive
      let changeRequest;
      if (driveId) {
        changeRequest = {
          driveId,
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      } else {
        changeRequest = {
          pageToken,
        };
      }
      const { changes, newStartPageToken } = (
        await drive.changes.list(changeRequest)
      ).data;
      const changedFiles = changes.map((change) => change.file);
      return {
        changedFiles,
        newStartPageToken,
      };
    },
    async getPageToken() {
      const drive = this.drive();
      return (await drive.changes.getStartPageToken({})).data.startPageToken;
    },
    async listDrives(pageToken) {
      const drive = this.drive();
      const resp = await drive.drives.list({ pageToken });
      const { drives, nextPageToken } = resp.data;
      // "My Drive" isn't returned from the list of drives,
      // so we add it to the list and assign it a static
      // ID that we can refer to when we need.
      const options = [{ label: "My Drive", value: "myDrive" }];
      for (const d of drives) {
        options.push({ label: d.name, value: d.id });
      }
      return {
        options,
        context: { nextPageToken },
      };
    },
    async listFiles(opts) {
      const drive = this.drive();
      // Listing files in My Drive and a shared drive requires
      // mutually-exclusive options, so we accept an object of
      // opts from the caller and pass them to the list method.
      const resp = await drive.files.list(opts);
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
    async watchDrive(id, address, pageToken, driveId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);

      // Google expects an entirely different object to be passed
      // when you make a watch request for My Drive vs. a shared drive
      // "My Drive" doesn't have a driveId, so if this method is called
      // without a driveId, we make a watch request for My Drive
      let watchRequest;
      if (driveId) {
        watchRequest = {
          driveId,
          pageToken,
          requestBody,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      } else {
        watchRequest = {
          pageToken,
          requestBody,
        };
      }
      // When watching for changes to an entire account, we must pass a pageToken,
      // which points to the moment in time we want to start watching for changes:
      // https://developers.google.com/drive/api/v3/manage-changes
      const { expiration, resourceId } = (
        await drive.changes.watch(watchRequest)
      ).data;
      console.log(`Watch request for drive successful, expiry: ${expiration}`);
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async watchFile(id, address, fileId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      const { expiration, resourceId } = (
        await drive.files.watch({
          fileId,
          requestBody,
          supportsAllDrives: true,
        })
      ).data;
      console.log(
        `Watch request for file ${fileId} successful, expiry: ${expiration}`
      );
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async stopNotifications(id, resourceId) {
      // id = channelID
      // See https://github.com/googleapis/google-api-nodejs-client/issues/627
      const drive = this.drive();

      // If for some reason the channel doesn't exist, this throws an error
      // It's OK for this to fail in those cases, since we'll renew the channel
      // immediately after trying to stop it if we still want notifications,
      // so we squash the error, log it, and move on.
      try {
        await drive.channels.stop({ resource: { id, resourceId } });
        console.log(`Stopped push notifications on channel ${id}`);
      } catch (err) {
        console.error(
          `Failed to stop channel ${id} for resource ${resourceId}: ${err}`
        );
      }
    },
  },
};
