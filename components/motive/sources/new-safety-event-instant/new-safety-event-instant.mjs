import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "motive-new-safety-event-instant",
  name: "New Safety Event (Instant)",
  description: "Emit new safety-related events like harsh braking or acceleration.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "driver_performance_event_created",
      ];
    },
    getSummary(event) {
      return `New Safety Event: ${event.type}`;
    },
  },
  sampleEmit,
};
