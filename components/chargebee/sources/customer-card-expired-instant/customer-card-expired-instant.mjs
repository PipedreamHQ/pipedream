import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-customer-card-expired-instant",
  name: "Customer Card Expired (Instant)",
  description: "Emit new event when a customer card has expired. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#card_expired). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.CARD_EXPIRED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getPaymentSources({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "updated_at",
        "status[is]": "expired",
      });
      return list;
    },
    generateMeta(event) {
      const { payment_source } = event.content ?? event;
      const id = `${payment_source.id}-${payment_source.updated_at}`;
      return {
        id,
        summary: `Card Expired: ${payment_source.id}`,
        ts: payment_source.updated_at,
      };
    },
  },
};
