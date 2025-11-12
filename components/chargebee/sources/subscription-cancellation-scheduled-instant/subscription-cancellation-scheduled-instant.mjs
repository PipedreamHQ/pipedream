import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "chargebee-subscription-cancellation-scheduled-instant",
  name: "Subscription Cancellation Scheduled (Instant)",
  description: "Emit new event when a subscription cancellation is scheduled. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_cancellation_scheduled). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_CANCELLATION_SCHEDULED,
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
        summary: `Subscription Cancelation Scheduled: ${subscription.id}`,
        ts: subscription.updated_at,
      };
    },
  },
};
