import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "payhip-new-subscription-created",
  name: "New Subscription Created (Instant)",
  description: "Emit new event when a new subscription is created. Webhook of type \"subscription.created\" must be created in Payhip Developer settings. [See the documentation](https://help.payhip.com/article/115-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "subscription.created";
    },
    generateMeta(event) {
      return {
        id: event.subscription_id,
        summary: `New Subscription: ${event.subscription_id}`,
        ts: event.date_subscription_started,
      };
    },
  },
  sampleEmit,
};
