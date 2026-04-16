import common from "../common/base.mjs";

export default {
  ...common,
  key: "jumpseller-order-updated",
  name: "Order Updated",
  description: "Emit new event when an order is updated in Jumpseller. [See the documentation](https://jumpseller.com/support/api/#tag/Hooks/paths/~1hooks.json/post)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "order_updated";
    },
    generateMeta(order) {
      return {
        id: `${order.id}-${Date.now()}`,
        summary: `Order Updated ID ${order.id}`,
        ts: Date.now(),
      };
    },
  },
};
