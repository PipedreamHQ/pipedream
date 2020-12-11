const axios = require("axios");
const { google } = require("googleapis");
const google_drive = require("../google_drive/google_drive.app.js");

module.exports = {
  ...google_drive,
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
    ...google_drive.methods,
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
    async getModifiedSheet(pageToken, driveId, sheetID) {
      const { changedFiles, newStartPageToken } = await this.getChanges(
        pageToken,
        driveId
      );
      let file;
      for (const changedFile of changedFiles) {
        if (
          changedFile.mimeType.includes("spreadsheet") &&
          sheetID == changedFile.id
        ) {
          file = changedFile;
        }
      }
      return {
        file,
        pageToken: newStartPageToken,
      };
    },
  },
};