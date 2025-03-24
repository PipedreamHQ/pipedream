import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "printful-new-order-instant",
  name: "New Order Created (Instant)",
  description: "Emit new event when a new order is created in your Printful account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "order_created",
      ];
    },
    getModelField() {
      return "order";
    },
    getSummary(body) {
      return `New order: ${body.data.order.id}`;
    },
  },
  sampleEmit,
};
