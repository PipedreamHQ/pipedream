import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "simplero-new-invoice",
  name: "New Invoice",
  description: "Emit new event when a new invoice is created. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#invoices)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.simplero.getInvoices;
    },
    getParams(lastId) {
      return {
        invoice_number_from: lastId,
      };
    },
    getIdField() {
      return "invoice_number";
    },
    getSummary(item) {
      return `New Invoice: ${item.invoice_number}`;
    },
  },
  sampleEmit,
};

