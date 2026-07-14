import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-checkout-abandoned",
  name: "Checkout Abandoned (Instant)",
  description: "Emit new event when a customer abandons their checkout. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "abandoned_checkout.created",
      ];
    },
  },
};
