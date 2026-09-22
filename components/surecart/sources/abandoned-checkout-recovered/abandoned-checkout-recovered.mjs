import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-abandoned-checkout-recovered",
  name: "New Abandoned Checkout Recovered (Instant)",
  description: "Emit new event when an abandoned checkout is recovered. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "abandoned_checkout.recovered",
      ];
    },
  },
};
