import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "security_reporter-new-finding-instant",
  name: "New Finding Created (Instant)",
  description: "Emit new event when a finding is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return [
        "finding:created",
      ];
    },
    getSummary(item) {
      return  `New Finding: ${item.title}`;
    },
  },
  sampleEmit,
};
