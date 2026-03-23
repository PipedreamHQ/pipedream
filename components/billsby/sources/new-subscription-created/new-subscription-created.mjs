import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "billsby-new-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new subscription is created. [See the documentation](https://support.billsby.com/reference/get-company-subscriptions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.billsby.listSubscriptions;
    },
    getParams() {
      return {
        orderByDescending: "createdOn",
      };
    },
    generateMeta(subscription) {
      return {
        id: subscription.subscriptionUniqueId,
        summary: `New Subscription with ID ${subscription.subscriptionUniqueId}`,
        ts: Date.parse(subscription.createdOn),
      };
    },
  },
};
