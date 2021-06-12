const newFilesInstant = require("../../../google_drive/sources/new-files-instant/new-files-instant.js");

module.exports = {
  ...newFilesInstant,
  key: "google_sheets-new-spreadsheet",
  name: "New Spreadsheet (Instant)",
  description:
    "Emits an event each time a new spreadsheet is created in a drive.",
  version: "0.0.2",
  props: {
    ...newFilesInstant.props,
  },
  methods: {
    ...newFilesInstant.methods,
    shouldProcess(file) {
      const watchedFolders = new Set(this.folders);
      return (
        (watchedFolders.size == 0 ||
          file.parents.some((p) => watchedFolders.has(p))) &&
        file.mimeType.includes("spreadsheet")
      );
    },
  },
};
