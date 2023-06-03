import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-subscription-created-instant",
  name: "New Subscription Created (Instant)",
  description: "Emit new event when a new subscription is created. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#subscription_created)",
  type: "source",
  version: "0.0.1",
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
