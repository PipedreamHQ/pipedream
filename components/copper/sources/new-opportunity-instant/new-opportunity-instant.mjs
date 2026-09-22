import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "copper-new-opportunity-instant",
  name: "New Opportunity (Instant)",
  description: "Emit new event when a new opportunity is created in Copper",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObjectType() {
      return "opportunity";
    },
    getSummary(item) {
      return `New opportunity created with ID ${item.ids[0]}`;
    },
  },
  sampleEmit,
};
