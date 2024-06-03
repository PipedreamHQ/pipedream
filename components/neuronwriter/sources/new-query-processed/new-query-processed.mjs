import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neuronwriter-new-query-processed",
  name: "New Query Processed",
  description: "Emit new event when a query is processed by NeuronWriter API and results are ready.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilter() {
      return {
        status: "ready",
      };
    },
    getSummary(item) {
      return `Query ${item.query} is ready.`;
    },
  },
  sampleEmit,
};
