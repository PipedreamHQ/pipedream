const {
  methods,
  ...common
} = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailgun-new-delivery",
  name: "New Delivery",
  type: "source",
  description: "Emit new event when an email is sent and accepted by the recipient email server.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...methods,
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
