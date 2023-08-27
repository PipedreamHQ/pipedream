import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_commerce-order-cancelled",
  name: "New Order Cancelled (Instant)",
  description: "Emit new event when an existing order is cancelled.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "salesorder.cancelled",
      ];
    },
    generateMeta(order) {
      const { salesorder } = order;
      return {
        id: salesorder.salesorder_id,
        summary: `Cancelled Order ${salesorder.salesorder_id}`,
        ts: Date.parse(salesorder.last_modified_time),
      };
    },
  },
};
