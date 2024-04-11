import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "acuity_scheduling-new-product-order-instant",
  name: "New Product Order (Instant)",
  description: "Emit new event when an order is completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getFn() {
      return this.acuityScheduling.getOrder;
    },
    getEvent() {
      return "order.completed";
    },
    getSummary(details) {
      return `New order completed: ${details.id}`;
    },
  },
  sampleEmit,
};
