import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mamo_business-new-successful-payment",
  name: "New Successful Payment (Instant)",
  description: "Emit new event when a payment is charged.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "charge.succeeded",
      ];
    },
    getSummary(body) {
      const { id } = body;
      return `A new payment with id ${id} was successfully charged!`;
    },
  },
  sampleEmit,
};
