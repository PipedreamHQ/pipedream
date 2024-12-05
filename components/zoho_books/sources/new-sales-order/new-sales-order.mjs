import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-sales-order",
  name: "New Sales Order",
  description: "Emit new event when a new sales order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.zohoBooks.listSalesorders;
    },
    getFieldName() {
      return "salesorders";
    },
    getFieldId() {
      return "salesorder_id";
    },
    getSummary(item) {
      return `New Sales Order: ${item.salesorder_number}`;
    },
  },
  sampleEmit,
};
