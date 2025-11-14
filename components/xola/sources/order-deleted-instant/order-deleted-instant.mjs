import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-order-deleted-instant",
  name: "Order Deleted (Instant)",
  description: "Emit new event when an order is deleted. [See the documentation](https://developers.xola.com/reference/webhook-introduction). **This source has been deprecated. Please use the 'Purchase Canceled (Instant)' source instead.**",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "order.delete";
    },
    generateMeta(body) {
      const { data } = body;
      const ts = Date.now();
      return {
        id: `${data.id}-${ts}`,
        summary: `Order Deleted ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
