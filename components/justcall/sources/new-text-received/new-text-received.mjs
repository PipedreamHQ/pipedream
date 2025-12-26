import common from "../common/base.mjs";

export default {
  ...common,
  key: "justcall-new-text-received",
  name: "New Text Received (Instant)",
  description: "Emit new event when a new text message is received.",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "sms.received";
    },
    generateMeta(data) {
      const { request_id: id } = data;
      return {
        id,
        summary: `New message with id: ${id} was received!`,
        ts: Date.now(),
      };
    },
  },
};
