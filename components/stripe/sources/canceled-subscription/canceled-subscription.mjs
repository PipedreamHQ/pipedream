import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-canceled-subscription",
  name: "Canceled Subscription",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new canceled subscription",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription_schedule.canceled",
        "customer.subscription.deleted",
      ];
    },
  },
};
