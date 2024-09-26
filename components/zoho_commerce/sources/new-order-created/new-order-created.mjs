import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_commerce-new-order-created",
  name: "New Order Created (Instant)",
  description: "Emit new event when a new order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "salesorder.created",
      ];
    },
    generateMeta(order) {
      const { salesorder } = order;
      return {
        id: salesorder.salesorder_id,
        summary: `New Order ${salesorder.salesorder_id}`,
        ts: Date.parse(salesorder.created_time),
      };
    },
  },
};
