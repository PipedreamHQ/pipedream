import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zest-new-gift-response-received-instant",
  name: "New Gift Response Received (Instant)",
  description: "Emit new event when a recipient sends a thank you note. [See the documentation](https://gifts.zest.co/admin/integrations/documentation#operation/createWebhookEndpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.GIFT_RESPONSE_RECEIVED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Response Received: ${resource.name}`,
        ts: +resource.ts,
      };
    },
  },
  sampleEmit,
};
