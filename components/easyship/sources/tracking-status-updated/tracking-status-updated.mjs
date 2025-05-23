import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "easyship-tracking-status-updated",
  name: "Tracking Status Updated (Instant)",
  description: "Emit new event when a tracking status is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "shipment_tracking_status_changed";
    },
  },
  sampleEmit,
};
