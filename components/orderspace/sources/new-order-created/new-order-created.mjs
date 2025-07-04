import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-order-created",
  name: "New Order Created (Instant)",
  description: "Emit new event when an order is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "order.created",
      ];
    },
    generateMeta(data) {
      return {
        id: data.order.id,
        summary: `Order ${data.order.id} created`,
        ts: Date.parse(data.order.created),
      };
    },
  },
  sampleEmit,
};
