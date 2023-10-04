import common from "../common/common.mjs";

export default {
  ...common,
  key: "goody-order-delivered",
  name: "Order Delivered",
  description: "Emit new event when an order is delivered in Goody.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getResourceFn() {
      return this.goody.listOrders;
    },
    isRelevant(item) {
      return item.status === "delivered";
    },
    generateMeta(order) {
      return {
        id: order.id,
        summary: `New Order ${order.id}`,
        ts: Date.now(),
      };
    },
  },
};
