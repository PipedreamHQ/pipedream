import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gmail_custom_oauth-new-email-received",
  name: "New Email Received",
  description: "Emit new event when an email is received. This source is capped at 100 max new messages per run.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(message) {
      const { value: subject } = message.payload.headers.find(({ name }) => name === "Subject");
      return {
        id: message.id,
        summary: `New email: ${subject}`,
        ts: message.internalDate,
      };
    },
    emitEvents(messages) {
      for (const message of messages) {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      }
    },
    async processMessageIds(messageIds) {
      const messages = await this.gmail.getMessages(messageIds);
      this.emitEvents(messages);
    },
  },
};
