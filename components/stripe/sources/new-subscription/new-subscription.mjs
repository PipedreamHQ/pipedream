import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-subscription",
  name: "New Subscription",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new subscription",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription_schedule.created",
        "customer.subscription.created",
      ];
    },
  },
};
