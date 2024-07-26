import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "v7_go-new-entity-instant",
  name: "New Entity Created (Instant)",
  description: "Emit new event when an entity is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return {
        "entity.created": true,
      };
    },
    getSummary({ entity }) {
      return `New entity created: ${entity.id}`;
    },
  },
  sampleEmit,
};
