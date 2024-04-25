import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "seatable-new-or-updated-row",
  name: "New or Updated Row (Instant)",
  description: "Emit new event when a row is added or updated in a table.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.data.op_type === "insert_row" || event.data.op_type === "modify_row";
    },
    generateMeta(event) {
      const ts = Date.now();
      const id = event.data.row_id;
      return {
        id: `${id}-${ts}`,
        summary: `New or Updated Row with ID ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
