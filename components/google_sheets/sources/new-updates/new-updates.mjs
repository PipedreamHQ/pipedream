import httpBase from "../common/http-based/sheet.mjs";
import sampleEmit from "./test-event.mjs";
import newUpdates from "../common/new-updates.mjs";

export default {
  ...httpBase,
  ...newUpdates,
  key: "google_sheets-new-updates",
  type: "source",
  name: "New Updates (Instant)",
  description: "Emit new event each time a row or cell is updated in a spreadsheet.",
  version: "0.3.0",
  dedupe: "unique",
  props: {
    ...httpBase.props,
    ...newUpdates.props,
  },
  methods: {
    ...httpBase.methods,
    ...newUpdates.methods,
  },
  sampleEmit,
};
