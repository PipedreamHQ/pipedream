import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "security_reporter-new-finding-updated-instant",
  name: "New Finding Updated (Instant)",
  description: "Emit new event when a finding is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return [
        "finding:updated",
      ];
    },
    getSummary(item) {
      return  `New finding updated: ${item.title}`;
    },
  },
  sampleEmit,
};
