import common from "../common/base.mjs";

export default {
  ...common,
  key: "lightspeed_retail_pos-inventory-updated",
  name: "Inventory Updated",
  description: "Emit new event when changes are made to the inventory, such as adding new items, deleting items, or updating stock levels. [See the documentation](https://developers.lightspeedhq.com/retail/endpoints/InventoryLog/#get-all-inventory-logs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "createTime";
    },
    getResourceFn() {
      return this.app.getInventoryLog;
    },
    getSortKey() {
      return "-inventoryLogID";
    },
    getResourceKey() {
      return "InventoryLog";
    },
    generateMeta(log) {
      return {
        id: log.inventoryLogID,
        summary: `Item ${log.itemID} - ${log.reason}`,
        ts: Date.parse(log[this.getTsField()]),
      };
    },
  },
};
