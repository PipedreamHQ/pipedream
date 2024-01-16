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
import sampleEmit from "./test-event.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../constants.mjs";

export default {
  ...common,
  key: "google_drive-new-or-modified-files",
  name: "New or Modified Files",
  description: "Emit new event any time any file in your linked Google Drive is added, modified, or deleted",
  version: "0.2.1",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    folders: {
      type: "string[]",
      label: "Folders",
      description: "The folders you want to watch for changes. Leave blank to watch for any new file in the Drive.",
      optional: true,
      default: [],
      options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const baseOpts = {
          q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        };
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
  hooks: {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        fields: "files",
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      await this.processChanges(files);
    },
    ...common.hooks,
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
        name: summary,
        modifiedTime: tsString,
      } = data;
      const ts = Date.parse(tsString);
      const eventId = headers && headers["x-goog-message-number"];

      return {
        id: `${fileId}-${eventId || ts}`,
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
    async shouldProcess(file) {
      const watchedFolders = new Set(this.folders);
      return (
        watchedFolders.size == 0 ||
        (file.parents && file.parents.some((p) => watchedFolders.has(p)))
      );
    },
    async processChanges(changedFiles, headers) {
      const changes = await this.getChanges(headers);

      for (const changedFile of changedFiles) {
        const filedata = await this.googleDrive.getFile(changedFile.id, {
          fields: "parents",
        });
        const file = {
          ...changedFile,
          ...filedata,
        };
        if (!(await this.shouldProcess(file))) {
          continue;
        }
        const eventToEmit = {
          file,
          ...changes,
        };
        const meta = this.generateMeta(file, headers);
        this.$emit(eventToEmit, meta);
      }
    },
  },
  sampleEmit,
};
