import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  key: "microsoft_excel-new-item-created",
  name: "New Spreadsheet Created (Instant)",
  description: "Emit new event when a new Excel spreadsheet is created.",
  version: "0.0.{{ts}}",
  type: "source",
  methods: {
    ...common.methods,
    generateMeta(item) {
      return {
        id: `${item.id}`,
        summary: `Item ${item.name} created`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
  sampleEmit,
};
