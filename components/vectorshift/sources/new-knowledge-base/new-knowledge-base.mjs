import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vectorshift-new-knowledge-base",
  name: "New Knowledge Base Created",
  description: "Emit new event when a knowledge base is created in Vectorshift.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listKnowledgeBases;
    },
    getSummary(item) {
      return `New Knowledge Base: ${item.name || item._id}`;
    },
  },
  sampleEmit,
};
