import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xendit-new-invoice",
  name: "New Invoice Created",
  description: "Emit new event when an invoice is created. [See the documentation](https://developers.xendit.co/api-reference/#create-invoice)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.xendit.listInvoices;
    },
    getCursor() {
      return "last_invoice_id";
    },
    getSummary(item) {
      return `New Invoice: ${item.id}`;
    },
  },
  sampleEmit,
};
