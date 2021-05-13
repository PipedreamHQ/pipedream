const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-spreadsheet",
  name: "New Spreadsheet (Instant)",
  description:
    "Emits an event each time a new spreadsheet is created in a drive.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    folders: {
      propDefinition: [
        common.props.google_sheets,
        "folders",
        (c) => ({ driveId: c.watchedDrive }),
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      this._setLastFileCreatedTime(Date.now());
    },
  },
  methods: {
    ...common.methods,
    shouldProcess(file) {
      const watchedFolders = new Set(this.folders);
      return (
        watchedFolders.size == 0 ||
        file.parents.some((p) => watchedFolders.has(p))
      );
    },
    async getSpreadsheetToProcess(event) {
      const pageToken = this._getPageToken();
      const {
        changedFiles,
        newStartPageToken,
      } = await this.google_sheets.getChanges(
        pageToken,
        this.watchedDrive === "myDrive" ? null : this.watchedDrive
      );
      this._setPageToken(newStartPageToken);

      const file = changedFiles
        .filter((file) => file.mimeType.includes("spreadsheet"))
        .shift();
      if (file && this.shouldProcess(file)) return file;
    },
    async processSpreadsheet(file) {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      let maxCreatedTime = lastFileCreatedTime;

      const fileInfo = await this.google_sheets.getFile(file.id);
      const createdTime = Date.parse(fileInfo.createdTime);
      if (createdTime > maxCreatedTime) maxCreatedTime = createdTime;
      if (createdTime <= lastFileCreatedTime) return;

      const meta = this.generateMeta(file, createdTime);
      this.$emit(fileInfo, meta);

      this._setLastFileCreatedTime(maxCreatedTime);
    },
    generateMeta(file, createdTime) {
      return {
        summary: `New File ID: ${file.id}`,
        id: file.id,
        ts: createdTime,
      };
    },
    _getLastFileCreatedTime() {
      return this.db.get("lastFileCreatedTime");
    },
    _setLastFileCreatedTime(lastFileCreatedTime) {
      this.db.set("lastFileCreatedTime", lastFileCreatedTime);
    },
    takeSheetSnapshot() {},
  },
  async run(event) {
    if (event.interval_seconds) {
      // Component was invoked by timer
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    const spreadsheet = await this.getSpreadsheetToProcess(event);
    await this.processSpreadsheet(spreadsheet);
  },
};