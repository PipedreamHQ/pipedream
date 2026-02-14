import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_drive-new-spreadsheet-polling",
  name: "New Spreadsheet (Polling)",
  description: "Emit new event when a new spreadsheet is created in a drive.",
  version: "0.0.2",
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
      description: "The specific folder(s) to watch for new spreadsheets. Leave blank to watch all folders in the Drive.",
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

      // Emit sample spreadsheets from the last 30 days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType = "application/vnd.google-apps.spreadsheet" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      for (const file of files) {
        if (this.shouldProcess(file)) {
          await this.emitSpreadsheet(file);
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
        ...args,
      });
    },
    shouldProcess(file) {
      // Check if it's a spreadsheet
      if (!file.mimeType || !file.mimeType.includes("spreadsheet")) {
        return false;
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
        createdTime: tsString,
      } = file;
      const ts = Date.parse(tsString);

      return {
        id: `${fileId}-${ts}`,
        summary,
        ts,
      };
    },
    async emitSpreadsheet(file) {
      const meta = this.generateMeta(file);
      this.$emit(file, meta);
    },
  },
  async run() {
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
        // Skip if not a spreadsheet
        if (!file.mimeType || !file.mimeType.includes("spreadsheet")) {
          continue;
        }

        // Get full file metadata including parents
        const fullFile = await this.googleDrive.getFile(file.id, {
          fields: "*",
        });

        // Check if it's a new spreadsheet (created after last run)
        const fileCreatedTime = Date.parse(fullFile.createdTime);
        if (fileCreatedTime <= lastRunTimestamp) {
          console.log(`Skipping existing spreadsheet ${fullFile.name || fullFile.id}`);
          continue;
        }

        if (!this.shouldProcess(fullFile)) {
          console.log(`Skipping spreadsheet ${fullFile.name || fullFile.id}`);
          continue;
        }

        await this.emitSpreadsheet(fullFile);
      }

      // Save the next page token after successfully processing
      this._setPageToken(nextPageToken);
    }

    // Update the last run timestamp after processing all changes
    this._setLastRunTimestamp(currentRunTimestamp);
  },
  sampleEmit,
};
