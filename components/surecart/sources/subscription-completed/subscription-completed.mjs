import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-subscription-completed",
  name: "Subscription Completed (Instant)",
  description: "Emit new event when a subscription is completed. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription.completed",
      ];
    },
  },
};
