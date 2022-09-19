// This source processes changes to specific files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push .
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in files in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

import common from "../common-webhook.mjs";

import {
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../constants.mjs";

/**
 * This source uses the Google Drive API's
 * {@link https://developers.google.com/drive/api/v3/reference/changes/watch changes: watch}
 * endpoint to subscribe to changes to the user's drive or a shard drive.
 */
export default {
  ...common,
  key: "google_drive-changes-to-specific-files-shared-drive",
  name: "Changes to Specific Files (Shared Drive)",
  description: "Watches for changes to specific files in a shared drive, emitting an event any time a change is made to one of those files",
  version: "0.0.1",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    files: {
      type: "string[]",
      label: "Files",
      description: "The files you want to watch for changes.",
      optional: true,
      default: [],
      options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const baseOpts = {};
        const opts = this.isMyDrive()
          ? baseOpts
          : {
            ...baseOpts,
            corpora: "drive",
            driveId: this.getDriveId(),
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
          };
        return this.googleDrive.listFilesOptions(nextPageToken, opts);
      },
    },
  },
  methods: {
    ...common.methods,
    getUpdateTypes() {
      return [
        GOOGLE_DRIVE_NOTIFICATION_ADD,
        GOOGLE_DRIVE_NOTIFICATION_CHANGE,
        GOOGLE_DRIVE_NOTIFICATION_UPDATE,
      ];
    },
    generateMeta(data, headers) {
      const {
        id: fileId,
        name: fileName,
        modifiedTime: tsString,
      } = data;
      const {
        "x-goog-message-number": eventId,
        "x-goog-resource-state": resourceState,
      } = headers;

      return {
        id: `${fileId}-${eventId}`,
        summary: `${resourceState.toUpperCase()} - ${
          fileName || "Untitled"
        }`,
        ts: Date.parse(tsString),
      };
    },
    isFileRelevant(file) {
      return this.files.includes(file.id);
    },
    async processChange(file, headers) {
      const eventToEmit = {
        file,
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };
      const meta = this.generateMeta(file, headers);
      this.$emit(eventToEmit, meta);
    },
    async processChanges(changedFiles, headers) {
      for (const file of changedFiles) {
        if (!this.isFileRelevant(file)) {
          console.log(`Skipping event for irrelevant file ${file.id}`);
          continue;
        }
        this.processChange(file, headers);
      }
    },
  },
};
