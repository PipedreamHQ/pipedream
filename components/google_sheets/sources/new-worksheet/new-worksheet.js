const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-worksheet",
  name: "New Worksheet (Instant)",
  description:
    "Emits an event each time a new worksheet is created in a spreadsheet.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        "sheetID",
        (c) => ({
          driveId: c.watchedDrive === "myDrive" ? null : c.watchedDrive,
        }),
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      await this.processSpreadsheet({ id: this.sheetID });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(worksheet) {
      return {
        id: worksheet.properties.sheetId,
        summary: worksheet.properties.title,
        ts: Date.now(),
      };
    },
    async processSpreadsheet({ spreadsheetId }) {
      const { sheets: worksheets } = await this.google_sheets.getSpreadsheet(
        spreadsheetId
      );
      for (const worksheet of worksheets) {
        const meta = this.generateMeta(worksheet);
        this.$emit(worksheet, meta);
      }
    },
    takeSheetSnapshot() {},
  },
};