import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "easyship-new-shipping-label-created",
  name: "New Shipping Label Created (Instant)",
  description: "Emit new event when a new shipping label is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "shipment_label_created";
    },
  },
  sampleEmit,
};
