import constants from "../../common/constants.mjs";
import events from "../common/events.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "chargebee-new-invoice-updated-instant",
  name: "New Invoice Updated (Instant)",
  description: "Emit new event when a new invoice is updated. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#invoice_updated). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.INVOICE_UPDATED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getInvoices({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "date",
      });
      return list;
    },
    generateMeta(event) {
      const { invoice } = event.content ?? event;
      return {
        id: invoice.id,
        summary: `New Invoice Updated: ${invoice.id}`,
        ts: invoice.updated_at,
      };
    },
  },
};
