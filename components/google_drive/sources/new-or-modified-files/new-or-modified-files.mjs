// This source processes changes to any files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push and here:
// https://developers.google.com/drive/api/v3/manage-changes
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel as needed

import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../common/constants.mjs";
import commonDedupeChanges from "../common-dedupe-changes.mjs";
import common from "../common-webhook.mjs";
import { stashFile } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

const { googleDrive } = common.props;

export default {
  ...common,
  key: "google_drive-new-or-modified-files",
  name: "New or Modified Files (Instant)",
  description: "Emit new event when a file in the selected Drive is created, modified or trashed.",
  version: "0.4.2",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    folders: {
      type: "string[]",
      label: "Folder(s)",
      description:
        "The folder(s) to watch for changes. Leave blank to watch for any new or modified file in the Drive.",
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
    watchForPropertiesChanges: {
      propDefinition: [
        googleDrive,
        "watchForPropertiesChanges",
      ],
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload file to your File Stash and emit temporary download link to the file. Google Workspace documents will be converted to PDF. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
    ...commonDedupeChanges.props,
  },
  hooks: {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        fields: "files",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      await this.processChanges(files);
    },
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    shouldProcess(file) {
      if (file.mimeType !== "application/vnd.google-apps.folder") {
        const watchedFolders = new Set(this.folders);
        return (
          watchedFolders.size == 0 ||
          (file.parents && file.parents.some((p) => watchedFolders.has(p)))
        );
      }
    },
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
        return {
          change: { },
        };
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
      const changes = await this.getChanges(headers);

      const filteredFiles = this.checkMinimumInterval(changedFiles);

      for (const file of filteredFiles) {
        file.parents = (await this.googleDrive.getFile(file.id, {
          fields: "parents",
        })).parents;

        console.log(file); // see what file was processed

        if (!this.shouldProcess(file)) {
          console.log(`Skipping file ${file.name}`);
          continue;
        }

        const eventToEmit = {
          file,
          ...changes,
        };
        if (this.includeLink) {
          eventToEmit.fileURL = await stashFile(file, this.googleDrive, this.dir);
        }
        const meta = this.generateMeta(file, headers);
        this.$emit(eventToEmit, meta);
      }
    },
  },
  sampleEmit,
};
