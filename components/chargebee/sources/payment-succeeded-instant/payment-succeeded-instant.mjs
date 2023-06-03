import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargebee-payment-succeeded-instant",
  name: "Payment Succeeded (Instant)",
  description: "Emit new event when a payment is successful. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#payment_succeeded)",
  type: "source",
  version: "0.0.1",
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
