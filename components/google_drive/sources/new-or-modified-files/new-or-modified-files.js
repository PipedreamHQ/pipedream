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
  key: "google_drive-new-or-modified-files",
  name: "New or Modified Files",
  description:
    "Emits a new event any time any file in your linked Google Drive is added, modified, or deleted",
  version: "0.0.12",
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

      this.db.set("pageToken", newStartPageToken);

      for (const file of changedFiles) {
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