import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_inventory-new-order",
  name: "New Sales Order",
  description: "Emit new event each time a new sales order is created in Zoho Inventory",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoInventory.listSalesOrders.bind(this);
    },
    getResourceType() {
      return "salesorders";
    },
    generateMeta(order) {
      return {
        id: order.salesorder_id,
        summary: `New Sales Order ${order.salesorder_number}`,
        ts: Date.parse(order.created_time),
      };
    },
  },
};
