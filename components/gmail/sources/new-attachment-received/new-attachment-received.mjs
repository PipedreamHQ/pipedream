import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    constructQuery() {
      const { q: query } = this;
      const hasAttachment = "has:attachment";
      return query?.includes(hasAttachment)
        ? query
        : [
          hasAttachment,
          query,
        ].join(" ").trim();
    },
    generateMeta(attachment, message) {
      return {
        id: attachment.body.attachmentId,
        summary: `New Attachment: ${attachment.filename}`,
        ts: message.internalDate,
      };
    },
    emitEvents(messages) {
      messages?.forEach((message) => {
        if (message) {
          const { parts: attachments } = message.payload;

          attachments.forEach((attachment) => {
            this.$emit({
              message,
              attachment,
            }, this.generateMeta(attachment, message));
          });
        }
      });
    },
    async processMessageIds(messageIds) {
      const messages = await this.gmail.getMessagesWithRetry(messageIds);
      console.log("Fetched messages", JSON.stringify(messages, null, 2));
      this.emitEvents(messages);
    },
  },
};
