import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-delivery",
  name: "New Delivery (Instant)",
  type: "source",
  description: "Emit new event when an email is sent and accepted by the recipient email server.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "delivered",
      ];
    },
    getEventType() {
      return [
        "delivered",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `New Delivery ${id} by ${payload.recipient}`,
        ts: payload.timestamp,
      };
    },
  },
};
