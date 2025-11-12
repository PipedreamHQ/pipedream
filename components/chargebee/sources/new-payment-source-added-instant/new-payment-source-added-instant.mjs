import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-new-payment-source-added-instant",
  name: "New Payment Source Added (Instant)",
  description: "Emit new event when a new payment source is added. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#payment_source_added). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.PAYMENT_SOURCE_ADDED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getPaymentSources({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "created_at",
      });
      return list;
    },
    generateMeta(event) {
      const { payment_source } = event.content ?? event;
      return {
        id: payment_source.id,
        summary: `New Payment Source: ${payment_source.id}`,
        ts: payment_source.created_at,
      };
    },
  },
};
