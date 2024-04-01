import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "seatable-new-row-created",
  name: "New Row Created (Instant)",
  description: "Emit new event when a new row is added to a table.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.data.op_type === "insert_row";
    },
    generateMeta(event) {
      const id = event.data.row_id;
      return {
        id,
        summary: `New Row with ID ${id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
