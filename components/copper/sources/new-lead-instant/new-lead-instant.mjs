import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "copper-new-lead-instant",
  name: "New Lead (Instant)",
  description: "Emit new event when a new lead is created in Copper",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObjectType() {
      return "lead";
    },
    getSummary(item) {
      return `New lead created with ID ${item.ids[0]}`;
    },
  },
  sampleEmit,
};
