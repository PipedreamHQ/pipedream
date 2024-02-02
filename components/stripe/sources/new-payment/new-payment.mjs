import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-payment",
  name: "New Payment",
  type: "source",
  version: "0.1.0",
  description: "Emit new event for each new payment",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_intent.created",
      ];
    },
  },
};
