import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shiphero-order-packed-out-instant",
  name: "Order Packed Out (Instant)",
  description: "Emit new event when an order is packed out. [See the documentation](https://developer.shiphero.com/webhooks#webhook_create).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.ORDER_PACKED_OUT;
    },
    generateMeta(resource) {
      return {
        id: resource.order_id,
        summary: `Order Packed Out: ${resource.order_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
