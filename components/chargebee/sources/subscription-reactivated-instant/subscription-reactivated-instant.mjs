import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-subscription-reactivated-instant",
  name: "Subscription Reactivated (Instant)",
  description: "Emit new event when a subscription is reactivated. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_reactivated)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.SUBSCRIPTION_REACTIVATED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getSubscriptions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "updated_at",
        "status[in]": "[active,in_trial]",
      });
      return list;
    },
    generateMeta(event) {
      const { subscription } = event.content ?? event;
      const id = `${subscription.id}-${subscription.updated_at}`;
      return {
        id,
        summary: `Subscription Reactivated: ${subscription.id}`,
        ts: subscription.updated_at,
      };
    },
  },
};
