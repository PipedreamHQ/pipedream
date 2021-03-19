// This source processes changes to any files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push and here:
// https://developers.google.com/drive/api/v3/manage-changes
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

const googleDrive = require("../../google_drive.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "google_drive-new-or-modified-folders",
  name: "New or Modified Folders",
  description:
    "Emits a new event any time any folder in your linked Google Drive is added, modified, or deleted",
  version: "0.0.1",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    updateTypes: { propDefinition: [googleDrive, "updateTypes"] },
    watchForPropertiesChanges: {
      propDefinition: [googleDrive, "watchForPropertiesChanges"],
    },
  },
  methods: {
    async processChanges(headers, pageToken) {
      const {
        changedFiles,
        newStartPageToken,
      } = await this.googleDrive.getChanges(
        pageToken,
        this.drive === "myDrive" ? null : this.drive
      );
      const files = changedFiles.filter((file) =>
        file.mimeType.includes("folder")
      );

      this.db.set("pageToken", newStartPageToken);

      for (const file of files) {
        // The changelog is updated each time a folder is opened. Check the folder's modifiedTime
        // to see if the folder has been modified.
        const modifiedTime = this.db.get(file.id) || null;
        const fileInfo = await this.googleDrive.getFile(file.id);
        if (modifiedTime == fileInfo.modifiedTime) continue;
        this.db.set(file.id, fileInfo.modifiedTime);

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
  },
};