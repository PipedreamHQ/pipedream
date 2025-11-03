import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-failed-payment",
  name: "New Failed Payment",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new failed payment",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_intent.payment_failed",
        "charge.failed",
      ];
    },
  },
};
