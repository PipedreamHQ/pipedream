import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "v7_go-complete-field-instant",
  name: "New Field Completion (Instant)",
  description: "Emit new event when a field within an entity is completed in V7 Go.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return {
        "entity.field_completed": true,
      };
    },
    getSummary({ entity }) {
      return `Field completed for entity ${entity.id}`;
    },
  },
  sampleEmit,
};
