import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "security_reporter-new-assessment-instant",
  name: "New Assessment Created (Instant)",
  description: "Emit new event when an assessment is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return [
        "assessment:created",
      ];
    },
    getSummary(item) {
      return  `New assessment created: ${item.title}`;
    },
  },
  sampleEmit,
};
