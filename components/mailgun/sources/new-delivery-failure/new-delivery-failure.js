const {
  methods,
  ...common
} = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailgun-new-delivery-failure",
  name: "New Delivery Failure",
  type: "source",
  description: "Emit new event when an email can't be delivered to the recipient email server.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...methods,
    getEventName() {
      return [
        "permanent_fail",
        "temporary_fail",
      ];
    },
    getEventType() {
      return [
        "failed",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      const error = payload["delivery-status"].description;
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `Delivery ${id} failed with error: "${error}"`,
        ts: payload.timestamp,
      };
    },
  },
};
