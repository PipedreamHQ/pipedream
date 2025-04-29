import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fakturoid-new-invoice",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created in Fakturoid.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.fakturoid.listInvoices;
    },
    getSummary(invoice) {
      return `New invoice created: ${invoice.number}`;
    },
  },
  sampleEmit,
};
