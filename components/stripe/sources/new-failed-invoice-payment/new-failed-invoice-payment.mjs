import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-failed-invoice-payment",
  name: "New Failed Invoice Payment",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new failed invoice payment",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invoice.payment_failed",
      ];
    },
  },
};
