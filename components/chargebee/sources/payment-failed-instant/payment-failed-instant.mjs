import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-payment-failed-instant",
  name: "Payment Failed (Instant)",
  description: "Emit new event when a payment is failed. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#payment_failed). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.PAYMENT_FAILED,
      ];
    },
    async getResources() {
      const { list } = await this.app.getTransactions({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "updated_at",
        "status[is]": "failure",
      });
      return list;
    },
    generateMeta(event) {
      const { transaction } = event.content ?? event;
      const id = `${transaction.id}-${transaction.updated_at}`;
      return {
        id,
        summary: `Payment Failed: ${transaction.id}`,
        ts: transaction.updated_at,
      };
    },
  },
};
