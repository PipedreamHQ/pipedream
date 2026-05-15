import common from "../common/base-new-created-resources.mjs";

export default {
  ...common,
  key: "corporate_merch-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.corporateMerch.listOrders;
    },
    getSummary(order) {
      return `New Order with ID: ${order.id}`;
    },
  },
};
