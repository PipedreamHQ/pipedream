import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shiphero-order-deallocated-instant",
  name: "Order Deallocated (Instant)",
  description: "Emit new event when an order is deallocated. [See the documentation](https://developer.shiphero.com/webhooks#webhook_create).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.ORDER_DEALLOCATED;
    },
    generateMeta(resource) {
      return {
        id: resource.order_id,
        summary: `Order Deallocated: ${resource.order_id}`,
        ts: Date.parse(resource.deallocated_at),
      };
    },
  },
  sampleEmit,
};
