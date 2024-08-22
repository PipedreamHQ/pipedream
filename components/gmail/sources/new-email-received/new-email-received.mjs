import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gmail-new-email-received",
  name: "New Email Received",
  description: "Emit new event when an email is received. This source is capped at 100 max new messages per run.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(message) {
      const selectedHeader = message.payload.headers.find(({ name }) => name === "Subject");
      const subject = selectedHeader?.value || "No subject";
      return {
        id: message.id,
        summary: `New email: ${subject}`,
        ts: message.internalDate,
      };
    },
    emitEvent(message) {
      const meta = this.generateMeta(message);
      this.$emit(this.decodeContent(message), meta);
    },
  },
};
