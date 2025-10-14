import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-order-shipped",
  name: "Order Shipped (Instant)",
  description: "Emit new event when a order is shipped.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "orders";
    },
    getItemAction() {
      return "shipped";
    },
    generateMeta(body) {
      return {
        id: body.order.id,
        summary: `Order with ID ${body.order.id} shipped`,
        ts: Date.parse(body.order.updatedAt),
      };
    },
  },
  sampleEmit,
};
