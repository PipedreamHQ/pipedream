import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-payment",
  name: "New Payment",
  type: "source",
  version: "0.1.5",
  description: "Emit new event for each new payment",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_intent.created",
      ];
    },
    emitEvent(event) {
      const amount = event.data.object?.amount;
      this.$emit(event, {
        id: event.id,
        summary: `New payment${amount
          ? " of $" + amount
          : ""} received`,
        ts: Date.parse(event.created),
      });
    },
  },
};
