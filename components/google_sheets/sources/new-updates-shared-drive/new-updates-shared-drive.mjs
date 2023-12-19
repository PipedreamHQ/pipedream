import httpBase from "../common/http-based/drive.mjs";
import sampleEmit from "./test-event.mjs";
import newUpdates from "../common/new-updates.mjs";

export default {
  ...httpBase,
  ...newUpdates,
  key: "google_sheets-new-updates-shared-drive",
  type: "source",
  name: "New Updates (Shared Drive, Instant)",
  description: "Emit new event each time a row or cell is updated in a spreadsheet in a shared drive",
  version: "0.2.0",
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
