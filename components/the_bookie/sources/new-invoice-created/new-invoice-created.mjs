import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "the_bookie-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.theBookie.listInvoices;
    },
    getSummary(item) {
      return `New Invoice: ${item.id}`;
    },
  },
  sampleEmit,
};
