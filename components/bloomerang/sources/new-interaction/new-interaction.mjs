import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bloomerang-new-interaction",
  name: "New Interaction",
  description: "Emit new event when a new interaction is logged for a constituent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listInteractions;
    },
    getSummary(item) {
      return `New Interaction: ${item.Channel}`;
    },
  },
  sampleEmit,
};
