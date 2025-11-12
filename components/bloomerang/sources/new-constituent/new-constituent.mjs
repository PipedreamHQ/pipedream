import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bloomerang-new-constituent",
  name: "New Constituent Created",
  description: "Emit new event when a new constituent profile is created in Bloomerang.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listConstituents;
    },
    getSummary(item) {
      return `New Constituent: ${item.FullName}`;
    },
  },
  sampleEmit,
};
