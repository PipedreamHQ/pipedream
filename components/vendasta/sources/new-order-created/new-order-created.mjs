import common from "../common/base.mjs";

export default {
  ...common,
  key: "vendasta-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order has been added in Vendasta [See the documentation](https://developers.vendasta.com/platform/04c72521bdcc4-list-orders)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(order) {
      return {
        id: order.id,
        summary: `New Order ID ${order.id}`,
        ts: Date.now(),
      };
    },
  },
};
