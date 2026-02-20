import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";

export default {
  key: "google_drive-new-or-modified-files-polling",
  name: "New or Modified Files (Polling)",
  description: "Emit new event when a file in the selected Drive is created, modified or trashed. [See the documentation](https://developers.google.com/drive/api/v3/reference/changes/list)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "Defaults to My Drive. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
      optional: false,
    },
    files: {
      propDefinition: [
        googleDrive,
        "fileId",
        ({ drive }) => ({
          drive,
        }),
      ],
      type: "string[]",
      label: "Files",
      description: "The specific file(s) to watch for changes. Leave blank to watch all files in the Drive. Note that events will only be emitted for files directly in these folders (not in their subfolders, unless also selected here)",
      optional: true,
      default: [],
    },
    folders: {
      propDefinition: [
        googleDrive,
        "folderId",
        ({ drive }) => ({
          drive,
          baseOpts: {
            q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and trashed = false`,
          },
        }),
      ],
      type: "string[]",
      label: "Folders",
      description: "The specific folder(s) to watch for changes. Leave blank to watch all folders in the Drive.",
      optional: true,
    },
    newFilesOnly: {
      type: "boolean",
      label: "New Files Only",
      description: "If enabled, only emit events for newly created files (based on `createdTime`)",
      default: false,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Get initial page token for change tracking
      const driveId = this.getDriveId();
      const startPageToken = await this.googleDrive.getPageToken(driveId);
      this._setPageToken(startPageToken);

      this._setLastRunTimestamp(Date.now());

      // Emit sample events from the last 30 days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        orderBy: "modifiedTime desc",
        fields: "*",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      for (const file of files) {
        if (this.shouldProcess(file)) {
          await this.emitFile(file);
        }
      }
    },
  },
  methods: {
    _getPageToken() {
      return this.db.get("pageToken");
    },
    _setPageToken(pageToken) {
      this.db.set("pageToken", pageToken);
    },
    _getLastRunTimestamp() {
      return this.db.get("lastRunTimestamp");
    },
    _setLastRunTimestamp(timestamp) {
      this.db.set("lastRunTimestamp", timestamp);
    },
    getDriveId(drive = this.drive) {
      return this.googleDrive.getDriveId(drive);
    },
    getListFilesOpts(args = {}) {
      return getListFilesOpts(this.drive, {
        q: "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
        ...args,
      });
    },
    shouldProcess(file, lastRunTimestamp) {
      // Skip folders
      if (file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE) {
        return false;
      }

      // Check if "new files only" mode is enabled
      if (this.newFilesOnly) {
        const fileCreatedTime = Date.parse(file.createdTime);
        // Only process files created after the last run
        if (fileCreatedTime <= lastRunTimestamp) {
          return false;
        }
      }

      // Check if specific files are being watched
      if (this.files?.length > 0) {
        if (!this.files.includes(file.id)) {
          return false;
        }
      }

      // Check if specific folders are being watched
      if (this.folders?.length > 0) {
        const watchedFolders = new Set(this.folders);
        if (!file.parents || !file.parents.some((p) => watchedFolders.has(p))) {
          return false;
        }
      }

      return true;
    },
    generateMeta(file) {
      const {
        id: fileId,
        name: summary,
        modifiedTime: tsString,
      } = file;
      const ts = Date.parse(tsString);

      return {
        id: `${fileId}-${ts}`,
        summary,
        ts,
      };
    },
    async emitFile(file) {
      const meta = this.generateMeta(file);
      this.$emit(file, meta);
    },
  },
  async run() {
    // Store the current run timestamp at the start
    const currentRunTimestamp = Date.now();
    const lastRunTimestamp = this._getLastRunTimestamp();

    const pageToken = this._getPageToken();
    const driveId = this.getDriveId();

    const changedFilesStream = this.googleDrive.listChanges(pageToken, driveId);

    for await (const changedFilesPage of changedFilesStream) {
      console.log("Changed files page:", changedFilesPage);
      const {
        changedFiles,
        nextPageToken,
      } = changedFilesPage;

      console.log(changedFiles.length
        ? `Processing ${changedFiles.length} changed files`
        : "No changed files since last run");

      for (const file of changedFiles) {
        // Get full file metadata including parents
        const fullFile = await this.googleDrive.getFile(file.id, {
          fields: "*",
        });

        if (!this.shouldProcess(fullFile, lastRunTimestamp)) {
          console.log(`Skipping file ${fullFile.name || fullFile.id}`);
          continue;
        }

        await this.emitFile(fullFile);
      }

      // Save the next page token after successfully processing
      this._setPageToken(nextPageToken);
    }

    // Update the last run timestamp after processing all changes
    this._setLastRunTimestamp(currentRunTimestamp);
  },
  sampleEmit,
};
