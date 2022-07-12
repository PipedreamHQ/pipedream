import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-temporary-failure",
  name: "New Temporary Failure (Instant)",
  type: "source",
  description: "Emit new event when an email can't be delivered to the recipient email server due " +
    "to a temporary mailbox error such as an ESP block. ESP is the Email Service Provider " +
    "managing the recipient email server.",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "temporary_fail",
      ];
    },
    getEventType() {
      return [
        "failed",
      ];
    },
    getEventSubtype() {
      return [
        "temporary",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      const error = payload["delivery-status"].description;
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `Delivery of "${id}" failed with temporary error: "${error}"`,
        ts: payload.timestamp,
      };
    },
  },
};
