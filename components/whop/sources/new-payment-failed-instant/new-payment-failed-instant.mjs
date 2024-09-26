import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whop-new-payment-failed-instant",
  name: "New Payment Failed (Instant)",
  description: "Emit new event when a payment attempt fails.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_failed",
      ];
    },
    getSummary({ id }) {
      return `New payment failed with id ${id}`;
    },
  },
  sampleEmit,
};
