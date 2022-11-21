import newFilesInstant from "../../../google_drive/sources/new-files-instant/new-files-instant.mjs";

export default {
  ...newFilesInstant,
  key: "google_sheets-new-spreadsheet",
  type: "source",
  name: "New Spreadsheet (Instant)",
  description: "Emit new event each time a new spreadsheet is created in a drive.",
  version: "0.0.13",
  hooks: {
    ...newFilesInstant.hooks,
    async deploy() {
      // Emit sample records on the first run
      const spreadsheets = await this.getSpreadsheets(10);
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
    async getSpreadsheets(limit) {
      const spreadsheets = [];
      const foldersIds = this.folders;
      for (const folderId of foldersIds) {
        const opts = this.getSpreadsheetsFromFolderOpts(folderId);
        const filesWrapper = await this.googleDrive.listFilesInPage(null, opts);
        for (const file of filesWrapper.files) {
          const fileInfo = await this.googleDrive.getFile(file.id);
          spreadsheets.push(fileInfo);
          if (spreadsheets.length >= limit) { return spreadsheets; }
        }
      }
      return spreadsheets;
    },
  },
};
