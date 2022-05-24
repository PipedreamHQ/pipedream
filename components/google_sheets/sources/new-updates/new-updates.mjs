import httpBase from "../common/http-based/sheet.mjs";
import newUpdates from "../common/new-updates.mjs";

export default {
  ...httpBase,
  ...newUpdates,
  key: "google_sheets-new-updates",
  type: "source",
  name: "New Updates (Instant)",
  description: "Emit new event each time a row or cell is updated in a spreadsheet. To use this source with a spreadsheet in a [Shared Drive](https://support.google.com/a/users/answer/9310351), use the **New Updates (Shared Drive, Instant)** source instead.",
  version: "0.0.27",
  dedupe: "unique",
  props: {
    ...httpBase.props,
    ...newUpdates.props,
  },
  methods: {
    ...httpBase.methods,
    ...newUpdates.methods,
  },
};
