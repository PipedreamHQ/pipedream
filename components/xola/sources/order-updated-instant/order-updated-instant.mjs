import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-order-updated-instant",
  name: "Order Updated (Instant)",
  description: "Emit new event when an order is updated. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "order.update";
    },
    generateMeta(body) {
      const { data } = body;
      const ts = Date.now();
      return {
        id: `${data.id}-${ts}`,
        summary: `Order Updated ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
