import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "digitalriver-new-order-completed",
  name: "New Order Completed (Instant)",
  description: "Emit new event when a customer successfully completes an order.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return [
        "order.accepted",
      ];
    },
    getSummary(body) {
      return `New order with ID: ${body.data.object.id} was successfully completed! `;
    },
  },
  sampleEmit,
};
