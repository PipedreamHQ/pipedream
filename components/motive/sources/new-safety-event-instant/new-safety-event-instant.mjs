import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "motive-new-safety-event",
  name: "New Safety Event",
  description: "Emit new safety-related events like harsh braking or acceleration.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.motive.listDriverPerformanceEvents;
    },
    getFieldName() {
      return "driver_performance_event";
    },
    getSummary(event) {
      return `New Safety Event: ${event.type}`;
    },
  },
  sampleEmit,
};
