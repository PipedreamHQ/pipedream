import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dolibarr-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dolibarr.listOrders;
    },
    getSummary(item) {
      return `Order ID ${item.id} created`;
    },
  },
  sampleEmit,
};
