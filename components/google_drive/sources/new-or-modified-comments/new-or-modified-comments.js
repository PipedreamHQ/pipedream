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
  key: "google_drive-new-or-modified-comments",
  name: "New or Modified Comments",
  description:
    "Emits a new event any time a file comment is added, modified, or deleted in your linked Google Drive",
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

      this.db.set("pageToken", newStartPageToken);

      for (const file of changedFiles) {
        const startModifiedTime = this.db.get(file.id) || null;
        let maxModifiedTime = startModifiedTime;
        const comments = await this.googleDrive.listComments(
          file.id,
          startModifiedTime
        );
        for (const comment of comments.comments) {
          if (
            !maxModifiedTime ||
            new Date(comment.modifiedTime) > new Date(maxModifiedTime)
          )
            maxModifiedTime = comment.modifiedTime;
          if (
            startModifiedTime &&
            new Date(comment.modifiedTime) <= new Date(startModifiedTime)
          )
            continue;

          const eventToEmit = {
            comment,
            file,
            change: {
              state: headers["x-goog-resource-state"],
              resourceURI: headers["x-goog-resource-uri"],
              changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
            },
          };

          this.$emit(eventToEmit, {
            summary: comment.content,
            id: headers["x-goog-message-number"],
          });
        }
        this.db.set(file.id, maxModifiedTime);
      }
    },
  },
};