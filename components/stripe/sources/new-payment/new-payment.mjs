import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-payment",
  name: "New Payment",
  type: "source",
  version: "0.1.1",
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
import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-payment",
  name: "New Payment",
  type: "source",
  version: "0.1.1",
  description: "Emit new event for each new payment",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_intent.created",
      ];
    },
    async onEvent(event) {
      const amount = 5500.00;
      this.$emit(event, {
        summary: `New payment of $${amount} received`,
        id: event.id,
        ts: event.created,
      });
    },
  },
};
