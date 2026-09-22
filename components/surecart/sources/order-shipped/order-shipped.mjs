import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-order-shipped",
  name: "Order Shipped (Instant)",
  description: "Emit new event when an order is shipped. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.shipped",
      ];
    },
  },
};
