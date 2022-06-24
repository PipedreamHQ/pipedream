import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-permanent-failure",
  name: "New Permanent Failure (Instant)",
  type: "source",
  description: "Emit new event when an email can't be delivered to the recipient email server due " +
    "to a permanent mailbox error such as non-existent mailbox.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "permanent_fail",
      ];
    },
    getEventType() {
      return [
        "failed",
      ];
    },
    getEventSubtype() {
      return [
        "permanent",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      const error = payload["delivery-status"].description;
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `Delivery of "${id}" failed with permanent error: "${error}"`,
        ts: payload.timestamp,
      };
    },
  },
};
