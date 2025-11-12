import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "copperx-invoice-paid",
  name: "New Invoice Paid (Instant)",
  description: "Emit new event when an invoice is paid.",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "invoice.marked_as_paid",
      ];
    },
    getSummary(id) {
      return `A new payment with id: ${id} was created!`;
    },
  },
  sampleEmit,
};
