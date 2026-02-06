import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  key: "microsoft_excel-new-item-updated",
  name: "New Spreadsheet Updated (Instant)",
  description: "Emit new event when an Excel spreadsheet is updated.",
  version: "0.0.6",
  type: "source",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const ts = Date.parse(item.lastModifiedDateTime);
      return {
        id: `${item.id}${ts}`,
        summary: `Item ${item.name} was updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
