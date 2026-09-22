import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-order-payment-failed",
  name: "New Order Payment Failed (Instant)",
  description: "Emit new event when an order payment fails. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.payment_failed",
      ];
    },
  },
};
