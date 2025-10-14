import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lightspeed_ecom_c_series-order-updated",
  name: "Order Updated (Instant)",
  description: "Emit new event when a order is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "orders";
    },
    getItemAction() {
      return "updated";
    },
    generateMeta(body) {
      return {
        id: body.order.id,
        summary: `Order with ID ${body.order.id} updated`,
        ts: Date.parse(body.order.updatedAt),
      };
    },
  },
  sampleEmit,
};
