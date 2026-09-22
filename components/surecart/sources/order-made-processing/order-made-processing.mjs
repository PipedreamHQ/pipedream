import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-order-made-processing",
  name: "Order Made Processing (Instant)",
  description: "Emit new event when an order is moved to processing status. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.made_processing",
      ];
    },
  },
};
