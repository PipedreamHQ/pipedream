import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-payment-succeeded-instant",
  name: "Payment Succeeded (Instant)",
  description: "Emit new event when a payment is successful. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#payment_succeeded). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.PAYMENT_SUCCEEDED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getTransactions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "date",
        "status[is]": "success",
      });
      return list;
    },
    generateMeta(event) {
      const { transaction } = event.content ?? event;
      return {
        id: transaction.id,
        summary: `New Payment: ${transaction.id}`,
        ts: transaction.date,
      };
    },
  },
};
