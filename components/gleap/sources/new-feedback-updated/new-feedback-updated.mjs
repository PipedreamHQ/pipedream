import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gleap-new-feedback-updated",
  name: "New Feedback Updated",
  description: "Emit new event when an existing feedback is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTimeField() {
      return "updatedAt";
    },
    generateMeta(item) {
      return {
        id: `${item.id}-${item.updatedAt}`,
        summary: `New feedback updated with Id: ${item.id}`,
        ts: item.updatedAt,
      };
    },
  },
  sampleEmit,
};
