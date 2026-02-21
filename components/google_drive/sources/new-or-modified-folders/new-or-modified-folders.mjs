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
import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "google_drive-new-or-modified-folders",
  name: "New or Modified Folders (Instant)",
  description: "Emit new event when a folder is created or modified in the selected Drive",
  version: "0.2.5",
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
        fields: "files(id, mimeType)",
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
    async getAllParents(folderId) {
      const allParents = [];
      let currentId = folderId;

      while (currentId) {
        const folder = await this.googleDrive.getFile(currentId, {
          fields: "parents",
        });
        const parents = folder.parents;

        if (parents && parents.length > 0) {
          allParents.push(parents[0]);
        }
        currentId = parents?.[0];
      }

      return allParents;
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
    async processChanges(changedFiles, headers, maxResults) {
      const files = changedFiles.filter(
        // API docs that define Google Drive folders:
        // https://developers.google.com/drive/api/v3/folder
        (file) => file.mimeType === "application/vnd.google-apps.folder",
      );

      const filteredFiles = [];
      for (const file of files) {
        // The changelog is updated each time a folder is opened. Check the
        // folder's `modifiedTime` to see if the folder has been modified.
        const fileInfo = await this.googleDrive.getFile(file.id);
        const root = await this.googleDrive.getFile(this.drive === "My Drive"
          ? "root"
          : this.drive);

        const allParents = [];
        if (this.includeSubfolders) {
          allParents.push(...(await this.getAllParents(file.id)));
        } else {
          allParents.push(fileInfo.parents[0]);
        }

        if (!allParents.includes(this.folderId || root.id)) {
          continue;
        }

        filteredFiles.push(fileInfo);
      }

      if (maxResults && filteredFiles.length >= maxResults) {
        filteredFiles.length = maxResults;
      }
      for (const file of filteredFiles) {
        const lastModifiedTimeForFile = this._getLastModifiedTimeForFile(file.id);
        const modifiedTime = Date.parse(file.modifiedTime);
        if (lastModifiedTimeForFile == modifiedTime) continue;

        const changes = await this.getChanges(headers);

        const eventToEmit = {
          file,
          ...changes,
        };
        const meta = this.generateMeta(file, modifiedTime);

        this.$emit(eventToEmit, meta);

        this._setModifiedTimeForFile(file.id, modifiedTime);
      }
    },
  },
};
