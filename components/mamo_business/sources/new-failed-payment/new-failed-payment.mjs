import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mamo_business-new-failed-payment",
  name: "New Failed Payment (Instant)",
  description: "Emit new event when a payment is failed.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "charge.failed",
        "subscription.failed",
      ];
    },
    getSummary(body) {
      const { id } = body;
      return `A new payment with id ${id} has been failed!`;
    },
  },
  sampleEmit,
};
