import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-subscription-renewal-reminder-sent",
  name: "Subscription Renewal Reminder Sent (Instant)",
  description: "Emit new event when a subscription renewal reminder is sent. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription.renewal_reminder_sent",
      ];
    },
  },
};
