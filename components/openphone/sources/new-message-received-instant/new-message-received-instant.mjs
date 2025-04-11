import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openphone-new-message-received-instant",
  name: "New Message Received (Instant)",
  description: "Emit new event when a new message is received",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "message.received",
      ];
    },
    getSummary() {
      return "New Message Received";
    },
    getWebhookType() {
      return "messages";
    },
  },
  sampleEmit,
};
