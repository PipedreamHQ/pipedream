import newFilesInstant from "../new-files-instant/new-files-instant.mjs";

export default {
  ...newFilesInstant,
  key: "google_drive-new-spreadsheet",
  type: "source",
  name: "New Spreadsheet (Instant)",
  description: "Emit new event when a new spreadsheet is created in a drive.",
  version: "0.1.18",
  props: {
    googleDrive: newFilesInstant.props.googleDrive,
    db: newFilesInstant.props.db,
    http: newFilesInstant.props.http,
    drive: newFilesInstant.props.drive,
    timer: newFilesInstant.props.timer,
    folders: {
      ...newFilesInstant.props.folders,
      description:
        "(Optional) The folders you want to watch. Leave blank to watch for any new spreadsheet in the Drive.",
    },
  },
  hooks: {
    ...newFilesInstant.hooks,
    async deploy() {
      // Emit sample records on the first run
      const spreadsheets = await this.getSpreadsheets(5);
      for (const fileInfo of spreadsheets) {
        const createdTime = Date.parse(fileInfo.createdTime);
        this.$emit(fileInfo, {
          summary: `New File: ${fileInfo.name}`,
          id: fileInfo.id,
          ts: createdTime,
        });
      }
    },
  },
  methods: {
    ...newFilesInstant.methods,
    shouldProcess(file) {
      return (
        file.mimeType.includes("spreadsheet") &&
        newFilesInstant.methods.shouldProcess.bind(this)(file)
      );
    },
    getSpreadsheetsFromFolderOpts(folderId) {
      const mimeQuery = "mimeType = 'application/vnd.google-apps.spreadsheet'";
      let opts = {
        q: `${mimeQuery} and parents in '${folderId}' and trashed = false`,
      };
      if (!this.isMyDrive()) {
        opts = {
          corpora: "drive",
          driveId: this.getDriveId(),
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
          ...opts,
        };
      }
      return opts;
    },
    getSpreadsheetsFromFiles(files, limit) {
      return files.reduce(async (acc, file) => {
        const spreadsheets = await acc;
        const fileInfo = await this.googleDrive.getFile(file.id);
        return spreadsheets.length >= limit
          ? spreadsheets
          : spreadsheets.concat(fileInfo);
      }, []);
    },
    async getSpreadsheets(limit) {
      const foldersIds = this.folders;

      if (!foldersIds.length) {
        const opts = this.getSpreadsheetsFromFolderOpts("root");
        const { files } = await this.googleDrive.listFilesInPage(null, opts);
        return this.getSpreadsheetsFromFiles(files, limit);
      }

      return foldersIds.reduce(async (spreadsheets, folderId) => {
        const opts = this.getSpreadsheetsFromFolderOpts(folderId);
        const { files } = await this.googleDrive.listFilesInPage(null, opts);
        const nextSpreadsheets = await this.getSpreadsheetsFromFiles(files, limit);
        return (await spreadsheets).concat(nextSpreadsheets);
      }, []);
    },
  },
};
