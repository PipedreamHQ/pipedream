import httpBase from "../common/http-based/sheet.mjs";
import newRowAdded from "../common/new-row-added.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...httpBase,
  ...newRowAdded,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description: "Emit new event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.2.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...httpBase.props,
    ...newRowAdded.props,
  },
  methods: {
    ...httpBase.methods,
    ...newRowAdded.methods,
  },
  sampleEmit,
};
