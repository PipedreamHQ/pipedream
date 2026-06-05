import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dolibarr-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dolibarr.listInvoices;
    },
    getSummary(item) {
      return `Invoice ID ${item.id} created`;
    },
  },
  sampleEmit,
};
