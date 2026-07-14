import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-order-fulfilled",
  name: "New Order Fulfilled (Instant)",
  description: "Emit new event when an order is fulfilled. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.fulfilled",
      ];
    },
  },
};
