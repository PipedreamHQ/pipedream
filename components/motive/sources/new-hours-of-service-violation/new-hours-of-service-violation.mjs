import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "motive-new-hours-of-service-violation",
  name: "New Hours of Service Violation",
  description: "Emit new event when a hos is emited.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.motive.listHosViolations;
    },
    getFieldName() {
      return "hos_violation";
    },
    getSummary(item) {
      return `New HOS Violation: ${item.id}`;
    },
  },
  sampleEmit,
};
