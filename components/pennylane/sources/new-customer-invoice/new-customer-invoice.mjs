import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pennylane-new-customer-invoice",
  name: "New Customer Invoice Created or Imported",
  description: "Emit new event when a new invoice is created or imported.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.pennylane.listInvoices;
    },
    getFieldName() {
      return "invoices";
    },
    getSummary(item) {
      return `New Invoice: ${item.invoice_number || item.label}`;
    },
  },
  sampleEmit,
};
