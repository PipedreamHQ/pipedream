import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invoice_ninja-new-payment-instant",
  name: "New Payment Registered (Instant)",
  description: "Emit new event when a new payment is registered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return 4;
    },
    getSummary(payment) {
      return `New payment created: ${payment.number}`;
    },
  },
  sampleEmit,
};
