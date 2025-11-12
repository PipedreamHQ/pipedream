import constants from "../../common/constants.mjs";
import events from "../common/events.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "chargebee-subscription-activated-instant",
  name: "New Subscription Activated (Instant)",
  description: "Emit new event when a subscription is activated. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_activated). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_ACTIVATED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getSubscriptions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "updated_at",
        "status[is]": "active",
      });
      return list;
    },
    generateMeta(event) {
      const { subscription } = event.content ?? event;
      const id = `${subscription.id}-${subscription.updated_at}`;
      return {
        id,
        summary: `Subscription Activated: ${subscription.id}`,
        ts: subscription.updated_at,
      };
    },
  },
};
