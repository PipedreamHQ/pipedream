import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "americommerce-new-valid-order-instant",
  name: "New Valid Order (Instant)",
  description: "Emit new event when a new valid order (not declined or cancelled) is created in your Americommerce store. [See the documentation](https://developers.cart.com/docs/rest-api/ZG9jOjM1MDU4Nw-webhooks#subscribing-to-a-webhook).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return events.NEW_VALID_ORDER;
    },
    generateMeta(resource) {
      const { order } = resource;
      return {
        id: order.id,
        summary: `New Valid Order: ${order.id}`,
        ts: Date.parse(order.created_at),
      };
    },
  },
  sampleEmit,
};
