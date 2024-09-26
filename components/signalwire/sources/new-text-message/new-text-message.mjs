import base from "../common/base.mjs";

export default {
  ...base,
  key: "signalwire-new-text-message",
  name: "New Text Message",
  description: "Emit new event when a new text message arrives",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.signalwire.listTextMessageLogs;
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New message from ${message.from} to ${message.to}`,
        ts: new Date(message.created_at).getTime(),
      };
    },
  },
};
