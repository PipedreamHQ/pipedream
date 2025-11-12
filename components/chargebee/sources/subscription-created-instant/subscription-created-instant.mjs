import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-subscription-created-instant",
  name: "New Subscription Created (Instant)",
  description: "Emit new event when a new subscription is created. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_created). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_CREATED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getSubscriptions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "created_at",
      });
      return list;
    },
    generateMeta(event) {
      const { subscription } = event.content ?? event;
      return {
        id: subscription.id,
        summary: `New Subscription: ${subscription.id}`,
        ts: subscription.created_at,
      };
    },
  },
};
