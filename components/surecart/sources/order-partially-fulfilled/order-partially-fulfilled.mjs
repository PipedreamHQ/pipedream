import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-order-partially-fulfilled",
  name: "New Order Partially Fulfilled (Instant)",
  description: "Emit new event when an order is partially fulfilled. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.partially_fulfilled",
      ];
    },
  },
};
