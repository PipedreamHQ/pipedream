import httpBase from "../common/http-based/sheet.mjs";
import newRowAdded from "../common/new-row-added.mjs";

export default {
  ...httpBase,
  ...newRowAdded,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description: "Emit new events each time a row or rows are added to the bottom of a spreadsheet. To use this source with a spreadsheet in a [Shared Drive](https://support.google.com/a/users/answer/9310351), use the **New Row Added (Shared Drive, Instant)** source instead.",
  version: "0.0.28",
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
