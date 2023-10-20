// This source processes changes to any files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push and here:
// https://developers.google.com/drive/api/v3/manage-changes
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

import common from "../common-webhook.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../constants.mjs";

export default {
  ...common,
  key: "google_drive-new-or-modified-folders",
  name: "New or Modified Folders",
  description: "Emit new event any time any folder in your linked Google Drive is added, modified, or deleted",
  version: "0.1.1",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  hooks: {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const { data } = await this.googleDrive.drive().files.list({
        q: `mimeType = "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        fields: "files(id, mimeType)",
      });

      await this.processChanges(data.files);
    },
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    _getLastModifiedTimeForFile(fileId) {
      return this.db.get(fileId);
    },
    _setModifiedTimeForFile(fileId, modifiedTime) {
      this.db.set(fileId, modifiedTime);
    },
    getUpdateTypes() {
      return [
        GOOGLE_DRIVE_NOTIFICATION_ADD,
        GOOGLE_DRIVE_NOTIFICATION_CHANGE,
        GOOGLE_DRIVE_NOTIFICATION_UPDATE,
      ];
    },
    generateMeta(data, ts) {
      const {
        id: fileId,
        name: summary,
      } = data;
      return {
        id: `${fileId}-${ts}`,
        summary,
        ts,
      };
    },
    async getChanges(headers) {
      if (!headers) {
        return;
      }
      const resourceUri = headers["x-goog-resource-uri"];
      const metadata = await this.googleDrive.getFileMetadata(`${resourceUri}&fields=*`);
      return {
        ...metadata,
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };
    },
    async processChanges(changedFiles, headers) {
      const files = changedFiles.filter(
        // API docs that define Google Drive folders:
        // https://developers.google.com/drive/api/v3/folder
        (file) => file.mimeType === "application/vnd.google-apps.folder",
      );

      for (const file of files) {
        // The changelog is updated each time a folder is opened. Check the
        // folder's `modifiedTime` to see if the folder has been modified.
        const fileInfo = await this.googleDrive.getFile(file.id);

        const lastModifiedTimeForFile = this._getLastModifiedTimeForFile(file.id);
        const modifiedTime = Date.parse(fileInfo.modifiedTime);
        if (lastModifiedTimeForFile == modifiedTime) continue;

        const changes = await this.getChanges(headers);

        const eventToEmit = {
          file: fileInfo,
          ...changes,
        };
        const meta = this.generateMeta(fileInfo, modifiedTime);

        this.$emit(eventToEmit, meta);

        this._setModifiedTimeForFile(file.id, modifiedTime);
      }
    },
  },
};
