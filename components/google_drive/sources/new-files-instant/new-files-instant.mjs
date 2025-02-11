import common from "../common-webhook.mjs";
import sampleEmit from "./test-event.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_drive-new-files-instant",
  name: "New Files (Instant)",
  description: "Emit new event when a new file is added in your linked Google Drive - LOG TEST",
  version: "1.2.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folders: {
      type: "string[]",
      label: "Folders",
      description:
        "(Optional) The folders you want to watch. Leave blank to watch for any new file in the Drive.",
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
      const deployLogs = [];
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      this.emitFiles(files, deployLogs);

      const ts = Date.now();
      this.$emit(
        deployLogs,
        {
          summary: "Deploy hook logs",
          id: `deploylogs-${ts}`,
          ts,
        },
      );
    },
    ...common.hooks,
    async activate() {
      await common.hooks.activate.bind(this)();
      this._setLastFileCreatedTime(Date.now());
    },
  },
  methods: {
    ...common.methods,
    _getLastFileCreatedTime() {
      return this.db.get("lastFileCreatedTime");
    },
    _setLastFileCreatedTime(lastFileCreatedTime) {
      this.db.set("lastFileCreatedTime", lastFileCreatedTime);
    },
    shouldProcess(file) {
      const watchedFolders = new Set(this.folders);
      return (
        watchedFolders.size == 0 ||
        (file.parents && file.parents.some((p) => watchedFolders.has(p)))
      );
    },
    getUpdateTypes() {
      return [
        GOOGLE_DRIVE_NOTIFICATION_ADD,
        GOOGLE_DRIVE_NOTIFICATION_CHANGE,
      ];
    },
    emitFiles(files, logs) {
      let count = 0;
      for (const file of files) {
        logs.push(this._generateLog("4A check file " + file.id));
        if (!this.shouldProcess(file)) {
          logs.push(this._generateLog("4B not proccessing file " + file.id));
          continue;
        }
        logs.push(this._generateLog("4C emit file " + file.id));
        this.$emit(file, {
          summary: `New File: ${file.name}`,
          id: file.id,
          ts: Date.parse(file.createdTime),
        });
        count++;
      }
      return count;
    },
    async processChanges(_changedFiles, _headers, logs) {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      const timeString = new Date(lastFileCreatedTime).toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      logs.push(this._generateLog("3A listed files in page: " + JSON.stringify(files)));

      if (!files?.length) {
        logs.push(this._generateLog("3B no files, ending"));
        return 0;
      }

      const emitCount = this.emitFiles(files, logs);

      logs.push(this._generateLog("3C finished emitting files, setting last created time"));
      this._setLastFileCreatedTime(Date.parse(files[0].createdTime));
      return emitCount;
    },
  },
  sampleEmit,
};
