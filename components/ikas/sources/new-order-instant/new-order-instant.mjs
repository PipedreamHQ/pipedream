import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ikas-new-order-instant",
  name: "New Order Created (Instant)",
  description: "Emit new event when a new order is created on ikas. **You can only have one webhook of each type at the same time.**",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScope() {
      return "store/order/created";
    },
    getSummary(data) {
      return `New order created with Id: ${data.id}.`;
    },
  },
  sampleEmit,
};
