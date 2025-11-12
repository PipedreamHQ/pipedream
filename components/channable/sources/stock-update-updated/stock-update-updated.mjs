import common from "../common/base.mjs";

export default {
  ...common,
  key: "channable-stock-update-updated",
  name: "Stock Update Updated",
  description: "Emit new event when a stock update is updated. [See the documentation](https://api.channable.com/v1/docs#tag/stock_updates/operation/get_stock_updates_companies__company_id__projects__project_id__offers_get)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.channable.listStockUpdates;
    },
    getTsField() {
      return "modified";
    },
    generateMeta(item) {
      const ts = Date.parse(item.modified);
      return {
        id: `${item.id}-${ts}`,
        summary: `Stock update updated: ${item.id}`,
        ts,
      };
    },
  },
};
