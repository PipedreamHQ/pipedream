import common from "../common/base.mjs";

export default {
  ...common,
  key: "jumpseller-order-paid",
  name: "Order Paid",
  description: "Emit new event when an order is paid in Jumpseller. [See the documentation](https://jumpseller.com/support/api/#tag/Hooks/paths/~1hooks.json/post)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "order_paid";
    },
    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order Paid ID ${order.id}`,
        ts: Date.now(),
      };
    },
  },
};
