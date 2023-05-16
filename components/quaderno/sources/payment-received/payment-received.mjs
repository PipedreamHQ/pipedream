import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "quaderno-payment-received",
  name: "Payment Received",
  description: "Trigger when a payment is successfully processed in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Webhooks/operation/createWebhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DEFAULT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
