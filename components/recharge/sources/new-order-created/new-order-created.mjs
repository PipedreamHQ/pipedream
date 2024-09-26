import common from "../common/common.mjs";

export default {
  ...common,
  key: "recharge-new-order-created",
  name: "New Order Created (Instant)",
  description: "Emit new event when a new order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary() {
      return "New Order";
    },
    getHookData() {
      return {
        topic: "order/created",
        included_objects: [
          "customer",
          "metafields",
        ],
      };
    },
  },
};
