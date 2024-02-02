import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "proabono-new-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new subscription is created. [See the documentation](https://docs.proabono.com/api/#list-subscriptions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.proabono.listSubscriptions;
    },
    generateMeta(subscription) {
      return {
        id: subscription.Id,
        summary: `New Subscription ${subscription.Id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
