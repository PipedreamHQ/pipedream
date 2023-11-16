import base from "../common/base.mjs";

export default {
  ...base,
  key: "flutterwave-new-subscription",
  name: "New Subscription",
  description: "Emit new event when a new subscription is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.flutterwave.getSubscriptions;
    },
    getParams(lastTs) {
      return lastTs
        ? {
          subscribed_from: this.formatDate(lastTs),
        }
        : {};
    },
    generateMeta(subscription) {
      return {
        id: subscription.id,
        summary: `New Subscription: ${subscription.id}`,
        ts: Date.parse(subscription.created_at),
      };
    },
  },
};
