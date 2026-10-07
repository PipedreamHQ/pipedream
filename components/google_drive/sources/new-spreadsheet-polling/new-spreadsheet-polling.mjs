import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import {
  CHANGE_FILTER_FILE_FIELDS,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_drive-new-spreadsheet-polling",
  name: "New Spreadsheet (Polling)",
  description: "Emit new event when a new spreadsheet is created in a drive.",
  version: "0.1.0",
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
    changesPageSize: {
      propDefinition: [
        googleDrive,
        "changesPageSize",
      ],
    },
    maxEmitsPerRun: {
      propDefinition: [
        googleDrive,
        "maxEmitsPerRun",
      ],
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

    const caughtUp = await this.googleDrive.processChangesPages({
      pageToken: this._getPageToken(),
      driveId: this.getDriveId(),
      pageSize: this.changesPageSize,
      fileFields: CHANGE_FILTER_FILE_FIELDS,
      maxEmits: this.maxEmitsPerRun,
      processPage: async (changedFiles) => {
        console.log(changedFiles.length
          ? `Processing ${changedFiles.length} changed files`
          : "No changed files since last run");

        let emitted = 0;
        for (const file of changedFiles) {
          // Skip if not a spreadsheet
          if (!file.mimeType || !file.mimeType.includes("spreadsheet")) {
            continue;
          }

          // Check if it's a new spreadsheet (created after last run)
          if (Date.parse(file.createdTime) <= lastRunTimestamp) {
            continue;
          }

          if (!this.shouldProcess(file)) {
            console.log(`Skipping spreadsheet ${file.name || file.id}`);
            continue;
          }
          // Full metadata only for files that emit
          const fullFile = await this.googleDrive.getFile(file.id, {
            fields: "*",
          });
          await this.emitSpreadsheet(fullFile);
          emitted++;
        }
        return emitted;
      },
      savePageToken: (nextPageToken) => this._setPageToken(nextPageToken),
    });

    // Files created during a backlog would be skipped if this moved before it drains
    if (caughtUp) {
      this._setLastRunTimestamp(currentRunTimestamp);
    }
  },
  sampleEmit,
};
