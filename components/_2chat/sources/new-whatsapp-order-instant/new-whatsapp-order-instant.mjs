import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_2chat-new-whatsapp-order-instant",
  name: "New WhatsApp Order (Instant)",
  description: "Emit new event when a WhatsApp order is received on user's 2Chat connected number.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "whatsapp.order.received";
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Order ID: ${body.id}`,
        ts: Date.parse(body.created_at),
      };
    },
  },
  sampleEmit,
};
