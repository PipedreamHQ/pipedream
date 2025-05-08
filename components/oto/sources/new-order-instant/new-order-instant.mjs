import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oto-new-order-instant",
  name: "New Order (Instant)",
  description: "Emit new event when a new order is placed. [See the documentation](https://apis.tryoto.com/#9671ca1f-7d06-43fc-8ee9-cf9c336b088d)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "newOrders";
    },
    generateMeta(event) {
      return {
        id: event.orderId,
        summary: `New Order with ID: ${event.orderId}`,
        ts: event.timestamp,
      };
    },
  },
  sampleEmit,
};
