import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new message is received in Hostaway.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(eventType) {
      return eventType === "message.received";
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message - ${message.id}`,
        ts: Date.parse(message.insertedOn),
      };
    },
  },
};
