import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "chargebee-payment-succeeded",
  name: "Payment Succeeded",
  description: "Emit new event when a payment is successful. [See the Documentation](https://apidocs.chargebee.com/docs/api/events#payment_succeeded)",
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
