import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "printful-order-status-updated-instant",
  name: "Order Status Updated (Instant)",
  description: "Emit new event when the status of an existing Printful order is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "order_updated",
      ];
    },
    getModelField() {
      return "order";
    },
    getSummary(body) {
      return `Order ${body.data.order.id} status updated to ${body.data.order.status}`;
    },
  },
  sampleEmit,
};
