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
  CHANGED_FILE_FIELDS,
  GOOGLE_DRIVE_MIME_TYPE_PREFIX,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
  MASS_CHANGE_MAX_AGE_MILLISECONDS,
  PDF_EXPORTABLE_MIME_TYPES,
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
  version: "2.0.0",
  type: "source",
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
      description: "Upload file to your File Stash and emit temporary download link to the file. Google Workspace documents will be converted to PDF. Files that can't be downloaded emit `fileURLError` instead. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
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
      this.flushFileIntervals();
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
    getChangesFileFields() {
      return CHANGED_FILE_FIELDS;
    },
    // Bulk moves and sharing list old files as changed; skip them unless properties
    // are watched. createdTime keeps new uploads that preserve an old modifiedTime.
    // Folder matching runs here too, so the per-run cap counts only files that can emit.
    isRelevantChange({
      time, file,
    }) {
      if (!this.shouldProcess(file)) {
        return false;
      }
      if (this.watchForPropertiesChanges || file.trashed || !time) {
        return true;
      }
      const changedAt = Date.parse(time);
      return [
        file.modifiedTime,
        file.createdTime,
      ].some((t) => !t || changedAt - Date.parse(t) <= MASS_CHANGE_MAX_AGE_MILLISECONDS);
    },
    generateMeta({
      id, name, modifiedTime, trashed,
    }) {
      return {
        id: `${id}-${modifiedTime}-${trashed}`,
        summary: name,
        ts: Date.parse(modifiedTime),
      };
    },
    getChanges(headers) {
      if (!headers) {
        return {
          change: {},
        };
      }
      return {
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };
    },
    async getFileLink(file) {
      const { mimeType } = file;
      if (mimeType.startsWith(GOOGLE_DRIVE_MIME_TYPE_PREFIX)
        && !PDF_EXPORTABLE_MIME_TYPES.includes(mimeType)) {
        return {
          fileURLError: `Files of type ${mimeType} can't be downloaded`,
        };
      }
      try {
        return {
          fileURL: await stashFile(file, this.googleDrive, this.dir),
        };
      } catch (error) {
        // Isolate per-file failures so one file can't block the page token; rate limits still retry
        if (this.googleDrive.isRetryableError(error, error.status || error.response?.status)) {
          throw error;
        }
        console.log(`Could not upload file ${file.name} to the File Stash: ${error.message}`);
        return {
          fileURLError: error.message,
        };
      }
    },
    async processChanges(changedFiles, headers) {
      const changes = this.getChanges(headers);
      const filteredFiles = this.filterByMinimumInterval(changedFiles);
      const emittedFileIds = [];

      try {
        for (const file of filteredFiles) {
          if (!this.shouldProcess(file)) {
            console.log(`Skipping file ${file.name}`);
            continue;
          }

          const eventToEmit = {
            file,
            ...changes,
          };
          if (this.includeLink) {
            Object.assign(eventToEmit, await this.getFileLink(file));
          }
          this.$emit(eventToEmit, this.generateMeta(file));
          emittedFileIds.push(file.id);
        }
      } finally {
        this.recordFileEmits(emittedFileIds);
      }
      return emittedFileIds.length;
    },
  },
  sampleEmit,
};
