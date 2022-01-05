import newFilesInstant from "../../../google_drive/sources/new-files-instant/new-files-instant.mjs";

export default {
  ...newFilesInstant,
  key: "google_sheets-new-spreadsheet",
  type: "source",
  name: "New Spreadsheet (Instant)",
  description:
    "Emit new event each time a new spreadsheet is created in a drive.",
  version: "0.0.7",
  methods: {
    ...newFilesInstant.methods,
    shouldProcess(file) {
      return (
        file.mimeType.includes("spreadsheet") &&
        newFilesInstant.methods.shouldProcess.bind(this)(file)
      );
    },
  },
};
