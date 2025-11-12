import common from "../common/base.mjs";

export default {
  ...common,
  key: "channable-new-stock-update-created",
  name: "New Stock Update Created",
  description: "Emit new event when a new stock update is created. [See the documentation](https://api.channable.com/v1/docs#tag/stock_updates/operation/get_stock_updates_companies__company_id__projects__project_id__offers_get)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.channable.listStockUpdates;
    },
    getTsField() {
      return "created";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New stock update created: ${item.id}`,
        ts: Date.parse(item.created),
      };
    },
  },
};
