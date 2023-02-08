import httpBase from "../common/http-based/drive.mjs";
import newRowAdded from "../common/new-row-added.mjs";

export default {
  ...httpBase,
  ...newRowAdded,
  key: "google_sheets-new-row-added-shared-drive",
  name: "New Row Added (Shared Drive, Instant)",
  description: "Emit new events each time a row or rows are added to the bottom of a spreadsheet in a shared drive",
  version: "0.0.4",
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
};
