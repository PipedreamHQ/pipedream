import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_drive-new-or-modified-folders-polling",
  name: "New or Modified Folders (Polling)",
  description: "Emit new event when a folder is created or modified in the selected Drive",
  version: "0.0.1",
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
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        ({ drive }) => ({
          drive,
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
      // Get initial page token for change tracking
      const driveId = this.getDriveId();
      const startPageToken = await this.googleDrive.getPageToken(driveId);
      this._setPageToken(startPageToken);

      this._setLastRunTimestamp(Date.now());

      // Emit sample folders from the last 30 days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType = "${GOOGLE_DRIVE_FOLDER_MIME_TYPE}" and modifiedTime > "${timeString}" and trashed = false`,
        fields: "*",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      for (const file of files) {
        if (await this.shouldProcess(file)) {
          await this.emitFolder(file);
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
    _getLastModifiedTimeForFile(fileId) {
      return this.db.get(fileId);
    },
    _setModifiedTimeForFile(fileId, modifiedTime) {
      this.db.set(fileId, modifiedTime);
    },
    getDriveId(drive = this.drive) {
      return this.googleDrive.getDriveId(drive);
    },
    getListFilesOpts(args = {}) {
      return getListFilesOpts(this.drive, {
        ...args,
      });
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
    async shouldProcess(file) {
      // Skip if not a folder
      if (file.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE) {
        return false;
      }

      // If no parent folder specified, process all folders
      if (!this.folderId) {
        return true;
      }

      const root = await this.googleDrive.getFile(this.drive === "My Drive"
        ? "root"
        : this.drive);

      const allParents = [];
      if (this.includeSubfolders) {
        allParents.push(...(await this.getAllParents(file.id)));
      } else if (file.parents) {
        allParents.push(file.parents[0]);
      }

      return allParents.includes(this.folderId || root.id);
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
    async emitFolder(file) {
      const meta = this.generateMeta(file);
      this.$emit(file, meta);
    },
  },
  async run() {
    const currentRunTimestamp = Date.now();

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
        // Skip if not a folder
        if (file.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE) {
          continue;
        }

        // Get full file metadata
        const fullFile = await this.googleDrive.getFile(file.id, {
          fields: "*",
        });

        const modifiedTime = Date.parse(fullFile.modifiedTime);
        const lastModifiedTimeForFile = this._getLastModifiedTimeForFile(fullFile.id);

        // Skip if not modified since last check
        if (lastModifiedTimeForFile === modifiedTime) {
          console.log(`Skipping unmodified folder ${fullFile.name || fullFile.id}`);
          continue;
        }

        if (!await this.shouldProcess(fullFile)) {
          console.log(`Skipping folder ${fullFile.name || fullFile.id}`);
          continue;
        }

        await this.emitFolder(fullFile);

        this._setModifiedTimeForFile(fullFile.id, modifiedTime);
      }

      // Save the next page token after successfully processing
      this._setPageToken(nextPageToken);
    }

    // Update the last run timestamp after processing all changes
    this._setLastRunTimestamp(currentRunTimestamp);
  },
  sampleEmit,
};
