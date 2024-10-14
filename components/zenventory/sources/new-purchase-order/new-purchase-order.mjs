import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zenventory-new-purchase-order",
  name: "New Purchase Order Created",
  description: "Emit new event when a new purchase order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getParams(lastDate) {
      return {
        createdFrom: lastDate,
        orderBy: "createdDate",
        orderDir: "desc",
      };
    },
    getFunction() {
      return this.zenventory.listPurchaseOrders;
    },
    getDataField() {
      return "purchaseOrders";
    },
    getFieldDate() {
      return "createdDate";
    },
    getSummary(item) {
      return `New Purchase Order: ${item.orderNumber}`;
    },
  },
  sampleEmit,
};
