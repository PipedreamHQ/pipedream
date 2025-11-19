import httpBase from "../common/http-based/sheet.mjs";
import newWorksheet from "../common/new-worksheet.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...httpBase,
  ...newWorksheet,
  key: "google_sheets-new-worksheet",
  type: "source",
  name: "New Worksheet (Instant)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet.",
  version: "0.2.3",
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
  sampleEmit,
};
