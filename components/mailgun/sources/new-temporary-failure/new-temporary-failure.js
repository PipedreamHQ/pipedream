const {
  methods,
  ...common
} = require("../common-webhook");

module.exports = {
  ...common,
  key: "mailgun-new-temporary-failure",
  name: "New Temporary Failure",
  type: "source",
  description: "Emit new event when an email can't be delivered to the recipient email server due " +
    "to a temporary mailbox error such as an ESP block. ESP is the Email Service Provider " +
    "managing the recipient email server.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...methods,
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
    emitEvent(payload) {
      if (
        this.getEventType().includes(payload.event) &&
        this.getEventSubtype().includes(payload.severity)
      ) {
        this.$emit(payload, this.generateMeta(payload));
      }
    },
  },
};
