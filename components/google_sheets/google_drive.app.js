const axios = require("axios");
const { google } = require("googleapis");

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
  },
  methods: {
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      return google.drive({ version: "v3", auth });
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
    async getPageToken(driveId) {
      const drive = this.drive();
      let request = {};
      if (driveId) {
        request = {
          driveId,
          supportsAllDrives: true,
        };
      }
      return (await drive.changes.getStartPageToken(request)).data
        .startPageToken;
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
    async listSheets(driveId, pageToken = null) {
      const drive = this.drive();
      let request;
      if (driveId) {
        request = {
          q: "mimeType='application/vnd.google-apps.spreadsheet'",
          corpora: "drive",
          driveId,
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      } else {
        request = {
          q: "mimeType='application/vnd.google-apps.spreadsheet'",
        };
      }
      const { files, nextPageToken } = (await drive.files.list(request)).data;
      const options = [];
      for (const f of files) {
        options.push({ label: f.name, value: f.id });
      }
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
    checkHeaders(headers, subscription, channelID) {
      if (
        !headers["x-goog-resource-state"] ||
        !headers["x-goog-resource-id"] ||
        !headers["x-goog-resource-uri"] ||
        !headers["x-goog-message-number"]
      ) {
        console.log("Request missing necessary headers: ", headers);
        return false;
      }

      const incomingChannelID = headers["x-goog-channel-id"];
      if (incomingChannelID !== channelID) {
        console.log(
          `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`
        );
        return false;
      }

      if (headers["x-goog-resource-id"] !== subscription.resourceId) {
        console.log(
          `Resource ID of ${resourceId} not currently being tracked. Exiting`
        );
        return false;
      }
      return true;
    },
    async checkResubscription(
      subscription,
      channelID,
      pageToken,
      endpoint,
      driveId
    ) {
      if (!subscription || !subscription.resourceId) {
        return;
      }
      console.log(
        `Notifications for resource ${subscription.resourceId} are expiring at ${subscription.expiration}. Renewing`
      );
      await this.stopNotifications(channelID, subscription.resourceId);
      const { expiration, resourceId } = await this.watchDrive(
        channelID,
        endpoint,
        pageToken,
        this.drive === "myDrive" ? null : this.drive
      );
      return { expiration, resourceId };
    },
    async getModifiedSheets(pageToken, driveId, sheetIDs) {
      const { changedFiles, newStartPageToken } = await this.getChanges(
        pageToken,
        driveId
      );
      const files = [];
      for (const file of changedFiles) {
        if (
          file.mimeType.includes("spreadsheet") &&
          (!sheetIDs || sheetIDs.length == 0 || sheetIDs.includes(file.id))
        ) {
          files.push(file);
        }
      }
      return {
        files,
        pageToken: newStartPageToken,
      };
    },
  },
};