import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pennylane-new-billing-subscription",
  name: "New Billing Subscription Created",
  description: "Emit new event when a billing subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.pennylane.listBillingSubscriptions;
    },
    getFieldName() {
      return "billing_subscriptions";
    },
    getSummary(item) {
      return `New Billing Subscription: ${item.id}`;
    },
  },
  sampleEmit,
};
