import common from "../common-webhook.mjs";
import sampleEmit from "./test-event.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
} from "../../constants.mjs";

export default {
  ...common,
  key: "google_drive-new-files-instant",
  name: "New Files (Instant)",
  description: "Emit new event any time a new file is added in your linked Google Drive",
  version: "0.1.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folders: {
      type: "string[]",
      label: "Folders",
      description:
        "(Optional) The folders you want to watch for changes. Leave blank to watch for any new file in the Drive.",
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
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
        pageSize: 25,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      this.emitFiles(files);
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
    emitFiles(files) {
      for (const file of files) {
        if (!this.shouldProcess(file)) {
          continue;
        }
        this.$emit(file, {
          summary: `New File: ${file.name}`,
          id: file.id,
          ts: Date.parse(file.createdTime),
        });
      }
    },
    async processChanges() {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      const timeString = new Date(lastFileCreatedTime).toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      if (!files?.length) {
        return;
      }

      this.emitFiles(files);

      this._setLastFileCreatedTime(Date.parse(files[0].createdTime));
    },
  },
  sampleEmit,
};
