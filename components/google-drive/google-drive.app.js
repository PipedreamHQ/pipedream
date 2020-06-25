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
    files: {
      type: "string[]",
      label: "Files",
      description: "The files you want to watch for changes.",
      optional: true,
      async options({ page, prevContext }) {
        const { nextPageToken } = prevContext;
        return await this.listFiles(nextPageToken);
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
    async getChanges(pageToken) {
      const drive = this.drive();
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
    async getPageToken() {
      const drive = this.drive();
      return (await drive.changes.getStartPageToken({})).data.startPageToken;
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
