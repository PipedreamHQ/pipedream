import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "payhip-subscription-canceled",
  name: "Subscription Canceled (Instant)",
  description: "Emit new event when a subscription is canceled. Webhook of type \"subscription.deleted\" must be created in Payhip Developer settings. [See the documentation](https://help.payhip.com/article/115-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "subscription.deleted";
    },
    generateMeta(event) {
      return {
        id: event.subscription_id,
        summary: `Subscription Canceled: ${event.subscription_id}`,
        ts: event.date_subscription_deleted,
      };
    },
  },
  sampleEmit,
};
