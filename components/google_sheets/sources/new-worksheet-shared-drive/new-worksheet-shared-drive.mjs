import httpBase from "../common/http-based/drive.mjs";
import newWorksheet from "../common/new-worksheet.mjs";

export default {
  ...httpBase,
  ...newWorksheet,
  key: "google_sheets-new-worksheet-shared-drive",
  type: "source",
  name: "New Worksheet (Shared Drive, Instant)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet in a shared drive",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...httpBase.hooks,
    ...newWorksheet.hooks,
  },
  props: {
    ...httpBase.props,
    ...newWorksheet.props,
  },
  methods: {
    ...httpBase.methods,
    ...newWorksheet.methods,
  },
};
