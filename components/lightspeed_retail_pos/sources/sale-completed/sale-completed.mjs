import common from "../common/base.mjs";

export default {
  ...common,
  key: "lightspeed_retail_pos-sale-completed",
  name: "New Sale Completed",
  description: "Emit new event when a sale is completed. [See the documentation](https://developers.lightspeedhq.com/retail/endpoints/Sale/#get-all-sales)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "completeTime";
    },
    getResourceFn() {
      return this.app.listSales;
    },
    getSortKey() {
      return "-completeTime";
    },
    getResourceKey() {
      return "Sale";
    },
    generateMeta(sale) {
      return {
        id: sale.saleID,
        summary: `Sale ${sale.saleID} completed`,
        ts: Date.parse(sale[this.getTsField()]),
      };
    },
  },
};
