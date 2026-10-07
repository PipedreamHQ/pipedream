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
  CHANGE_FILTER_FILE_FIELDS,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../common/constants.mjs";
import common from "../common-webhook.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "google_drive-new-or-modified-folders",
  name: "New or Modified Folders (Instant)",
  description: "Emit new event when a folder is created or modified in the selected Drive",
  version: "1.0.0",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      label: "Parent Folder",
      description: "The ID of the parent folder which contains the folders. If not specified, it will watch all folders from the drive's top-level folder.",
      optional: true,
    },
    includeSubfolders: {
      type: "boolean",
      label: "Include Subfolders",
      description: "Whether to include subfolders of the parent folder in the changes.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType = "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        fields: `files(${CHANGE_FILTER_FILE_FIELDS})`,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      await this.processChanges(files, null, 5);
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
    getChangesFileFields() {
      return CHANGE_FILTER_FILE_FIELDS;
    },
    async getAllParents(folderId, parentsCache = new Map()) {
      const allParents = [];
      let currentId = folderId;

      while (currentId) {
        if (!parentsCache.has(currentId)) {
          const { parents } = await this.googleDrive.getFile(currentId, {
            fields: "parents",
          });
          parentsCache.set(currentId, parents?.[0]);
        }
        currentId = parentsCache.get(currentId);
        if (currentId) {
          allParents.push(currentId);
        }
      }

      return allParents;
    },
    generateMeta(data, ts) {
      const {
        id: fileId,
        name: summary,
      } = data;
      return {
        id: md5(`${fileId}-${ts}`),
        summary,
        ts,
      };
    },
    getChanges(headers) {
      if (!headers) {
        return {
          change: { },
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
    async processChanges(changedFiles, headers, maxResults) {
      const folders = changedFiles.filter(
        (file) => file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE,
      );
      if (!folders.length) {
        return 0;
      }

      const targetId = this.folderId
        || (await this.googleDrive.getFile(this.isMyDrive()
          ? "root"
          : this.drive, {
          fields: "id",
        })).id;
      const parentsCache = new Map();

      const filteredFiles = [];
      for (const file of folders) {
        // The changelog is updated each time a folder is opened. Check the
        // folder's `modifiedTime` to see if the folder has been modified.
        if (this._getLastModifiedTimeForFile(file.id) == Date.parse(file.modifiedTime)) {
          continue;
        }

        const allParents = this.includeSubfolders
          ? await this.getAllParents(file.id, parentsCache)
          : (file.parents ?? []).slice(0, 1);
        if (allParents.includes(targetId)) {
          filteredFiles.push(file);
        }
      }

      if (maxResults && filteredFiles.length >= maxResults) {
        filteredFiles.length = maxResults;
      }
      if (!filteredFiles.length) {
        return 0;
      }

      const changes = this.getChanges(headers);
      for (const { id } of filteredFiles) {
        const file = await this.googleDrive.getFile(id);
        const modifiedTime = Date.parse(file.modifiedTime);

        const eventToEmit = {
          file,
          ...changes,
        };
        const meta = this.generateMeta(file, modifiedTime);

        this.$emit(eventToEmit, meta);

        this._setModifiedTimeForFile(file.id, modifiedTime);
      }
      return filteredFiles.length;
    },
  },
};
