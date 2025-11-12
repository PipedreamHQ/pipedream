import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "copper-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a person object is newly created in Copper",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObjectType() {
      return "person";
    },
    getSummary(item) {
      return `New person created with ID ${item.ids[0]}`;
    },
  },
  sampleEmit,
};
