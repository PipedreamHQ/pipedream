import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "the_bookie-new-invoice-paid",
  name: "New Invoice Paid",
  description: "Emit new event when the state of an invoice is changed to 'paid'.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    filterItems(items) {
      return items.filter((item) => item.state === 20);
    },
    getFunction() {
      return this.theBookie.listInvoices;
    },
    getSummary(item) {
      return `Invoice ${item.id} paid`;
    },
  },
  sampleEmit,
};
