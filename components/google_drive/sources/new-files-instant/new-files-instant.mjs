import common from "../common-webhook.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
} from "../../constants.mjs";

export default {
  ...common,
  key: "google_drive-new-files-instant",
  name: "New Files (Instant)",
  description: "Emit new event any time a new file is added in your linked Google Drive",
  version: "0.0.15",
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
          q: "mimeType = 'application/vnd.google-apps.folder'",
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
    async processChanges(changedFiles) {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      let maxCreatedTime = lastFileCreatedTime;

      for (const file of changedFiles) {
        const fileInfo = await this.googleDrive.getFile(file.id);
        const createdTime = Date.parse(fileInfo.createdTime);
        if (
          !this.shouldProcess(fileInfo) ||
          createdTime < lastFileCreatedTime
        ) {
          continue;
        }

        this.$emit(fileInfo, {
          summary: `New File: ${fileInfo.name}`,
          id: file.id,
          ts: createdTime,
        });

        maxCreatedTime = Math.max(createdTime, maxCreatedTime);
        this._setLastFileCreatedTime(maxCreatedTime);
      }
    },
  },
};
