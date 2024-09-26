import common from "../common/common.mjs";

export default {
  ...common,
  key: "goody-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created in Goody.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.goody.listOrders;
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
