import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "payhip-payment-refunded",
  name: "Payment Refunded (Instant)",
  description: "Emit new event when a payment is refunded. Webhook of type \"refunded\" must be created in Payhip Developer settings. [See the documentation](https://help.payhip.com/article/115-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "refunded";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Payment Refunded: ${event.id}`,
        ts: event.date_created,
      };
    },
  },
  sampleEmit,
};
