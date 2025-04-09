import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vectorshift-new-pipeline",
  name: "New Pipeline Created",
  description: "Emit new event when a new pipeline is created in VectorShift.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listPipelines;
    },
    getSummary(item) {
      return `New Pipeline Created: ${item.name || item._id}`;
    },
  },
  sampleEmit,
};
