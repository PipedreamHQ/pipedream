import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fakturoid-invoice-updated",
  name: "New Invoice Updated",
  description: "Emit new event when an invoice is created or updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.fakturoid.listInvoices;
    },
    getSummary(invoice) {
      return `New invoice updated: ${invoice.number}`;
    },
    getParams(lastDate) {
      return {
        updated_since: lastDate,
      };
    },
    getDateField() {
      return "updated_at";
    },
  },
  sampleEmit,
};
