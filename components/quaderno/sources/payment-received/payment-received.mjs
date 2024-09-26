import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "quaderno-payment-received",
  name: "New Payment Received",
  description: "Emit new event when a payment is successfully processed in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Webhooks/operation/createWebhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        events.PAYMENT_CREATED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Payment: ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
