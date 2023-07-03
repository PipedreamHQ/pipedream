import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-subscription-updated",
  name: "Subscription Updated",
  type: "source",
  version: "0.0.1",
  description: "Emit new event on a new subscription is updated",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription_schedule.updated",
      ];
    },
  },
};
