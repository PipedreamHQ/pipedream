import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oto-order-status-updated-instant",
  name: "Order Status Updated (Instant)",
  description: "Emit new event when the status of an order changes. [See the documentation](https://apis.tryoto.com/#9671ca1f-7d06-43fc-8ee9-cf9c336b088d)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "orderStatus";
    },
    generateMeta(event) {
      return {
        id: event.orderId,
        summary: `Status Updated for Order with ID: ${event.orderId}`,
        ts: event.timestamp,
      };
    },
  },
  sampleEmit,
};
