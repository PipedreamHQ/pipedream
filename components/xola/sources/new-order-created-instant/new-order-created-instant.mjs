import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-new-order-created-instant",
  name: "New Order Created (Instant)",
  description: "Emit new event when a new order is created. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "order.create";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Order ${data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
