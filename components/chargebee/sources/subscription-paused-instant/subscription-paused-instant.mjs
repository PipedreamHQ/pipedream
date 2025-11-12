import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-subscription-paused-instant",
  name: "Subscription Paused (Instant)",
  description: "Emit new event when a subscription is paused. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_paused). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_PAUSED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getSubscriptions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "updated_at",
        "status[is]": "paused",
      });
      return list;
    },
    generateMeta(event) {
      const { subscription } = event.content ?? event;
      const id = `${subscription.id}-${subscription.updated_at}`;
      return {
        id,
        summary: `Subscription Paused: ${subscription.id}`,
        ts: subscription.updated_at,
      };
    },
  },
};
