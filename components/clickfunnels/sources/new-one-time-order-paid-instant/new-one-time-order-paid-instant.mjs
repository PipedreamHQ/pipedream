import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickfunnels-new-one-time-order-paid-instant",
  name: "New One-Time Order Paid (Instant)",
  description: "Emit new event when a one-time order gets paid by a customer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "one-time-order.invoice.paid",
      ];
    },
    getSummary(body) {
      return `New one time order with Id: ${body.data.id} paid successfully!`;
    },
  },
  sampleEmit,
};
