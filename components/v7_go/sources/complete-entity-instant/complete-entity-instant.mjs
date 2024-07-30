import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "v7_go-complete-entity-instant",
  name: "New Complete Entity (Instant)",
  description: "Emit new event when all fields of an entity are completed in V7 Go.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return {
        "entity.all_fields_completed": true,
      };
    },
    getSummary({ entity }) {
      return `Entity all fields completed: ${entity.id}`;
    },
  },
  sampleEmit,
};
