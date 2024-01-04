import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gleap-new-feedback-created",
  name: "New Feedback Created",
  description: "Emit new event when a feedback is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTimeField() {
      return "createdAt";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New feedback with Id: ${item.id}`,
        ts: item.createdAt,
      };
    },
  },
  sampleEmit,
};
