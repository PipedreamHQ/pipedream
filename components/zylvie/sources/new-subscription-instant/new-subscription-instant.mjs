import common from "../common/webhook.mjs";
import triggers from "../common/triggers.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zylvie-new-subscription-instant",
  name: "New Subscription (Instant)",
  description: "Emit new event when a user subscribes to a subscription product, whether free trial or otherwise. [See the documentation](https://developers.zylvie.com/webhooks/subscribe).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggers.SUBSCRIPTION;
    },
    generateMeta(payload) {
      const { data: resource } = payload;
      return {
        id: resource.subscription_id,
        summary: `New Subscription: ${resource.subscription_id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
