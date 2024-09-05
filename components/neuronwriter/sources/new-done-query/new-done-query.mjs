import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neuronwriter-new-done-query",
  name: "New Done Query",
  description: "Emit new event when a query is marked as 'done', indicating content is ready for publication.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilter() {
      return {
        tags: [
          "Done",
        ],
      };
    },
    getSummary(item) {
      return `Query ID: ${item.query} marked as 'done'`;
    },
  },
  sampleEmit,
};
