import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_inventory-new-item",
  name: "New Item",
  description: "Emit new event each time a new item is created in Zoho Inventory",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoInventory.listItems.bind(this);
    },
    getResourceType() {
      return "items";
    },
    generateMeta(item) {
      return {
        id: item.item_id,
        summary: `New Item ${item.name}`,
        ts: Date.parse(item.created_time),
      };
    },
  },
};
