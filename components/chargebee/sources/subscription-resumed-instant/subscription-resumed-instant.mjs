import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "chargebee-subscription-resumed-instant",
  name: "Subscription Resumed (Instant)",
  description: "Emit new event when a subscription is resumed. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_resumed). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_RESUMED,
      ];
    },
    getResources() {
      return [];
    },
    generateMeta(event) {
      const { subscription } = event.content ?? event;
      const id = `${subscription.id}-${subscription.updated_at}`;
      return {
        id,
        summary: `Subscription Resumed: ${subscription.id}`,
        ts: subscription.updated_at,
      };
    },
  },
};
