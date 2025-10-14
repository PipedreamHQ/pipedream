import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-order-created",
  name: "New Order Created (Instant)",
  description: "Emit new event when a order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "orders";
    },
    getItemAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.order.id,
        summary: `Order with ID ${body.order.id} created`,
        ts: Date.parse(body.order.createdAt),
      };
    },
  },
  sampleEmit,
};
