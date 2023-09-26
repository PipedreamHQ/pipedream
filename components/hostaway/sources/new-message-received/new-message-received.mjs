import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new message is received in Hostaway.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(message) {
      return {
        id: message.id,
        summary: "",
        ts: "",
      };
    },
  },
};
