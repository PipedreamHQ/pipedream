import httpBase from "../common/http-based/sheet.mjs";
import newWorksheet from "../common/new-worksheet.mjs";

export default {
  ...httpBase,
  ...newWorksheet,
  key: "google_sheets-new-worksheet",
  type: "source",
  name: "New Worksheet (Instant)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet. To use this source with a spreadsheet in a [Shared Drive](https://support.google.com/a/users/answer/9310351), use the **New Worksheet (Shared Drive, Instant)** source instead.",
  version: "0.1.1",
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
