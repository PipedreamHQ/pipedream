import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gmail-new-attachment",
  name: "New Attachment",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(attachment, message) {
      return {
        id: attachment.body.attachmentId,
        summary: `New attachment: ${attachment.filename}`,
        ts: message.internalDate,
      };
    },
    emitEvents(messages) {
      for (const message of messages) {
        const attachments = message.payload.parts.filter((part) => part.body.attachmentId);
        const numAttachments = attachments.length;
        if (!numAttachments) continue;
        const suffix = numAttachments === 1
          ? ""
          : "s";
        console.log(`Emitting event${suffix} for ${numAttachments} attachment${suffix} found for message`);
        for (const attachment of attachments) {
          const meta = this.generateMeta(attachment, message);
          this.$emit({
            message,
            attachment,
          }, meta);
        }
      }
    },
    filterMessagesWithAttachments(messages) {
      return messages.filter(
        (message) => message.payload.parts?.filter((part) => part.body?.attachmentId).length,
      );
    },
    async processMessageIds(messageIds) {
      const messages = this.filterMessagesWithAttachments(
        await this.gmail.getMessages(messageIds),
      );
      this.emitEvents(messages);
    },
  },
};
