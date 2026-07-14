import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-subscription-made-trialing",
  name: "New Subscription Made Trialing (Instant)",
  description: "Emit new event when a subscription enters trial status. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription.made_trialing",
      ];
    },
  },
};
