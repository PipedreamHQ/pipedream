import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    constructQuery(lastDate) {
      const { q: query } = this;
      const hasAttachment = query.includes("has:attachment")
        ? ""
        : "has:attachment";
      const after = !query.includes("after:") && lastDate
        ? `after:${lastDate / 1000}`
        : "";
      return [
        hasAttachment,
        after,
        query,
      ].join(" ").trim();
    },
    generateMeta(attachment, message) {
      return {
        id: `${message.id}${attachment.partId}`,
        summary: `New Attachment: ${attachment.filename}`,
        ts: message.internalDate,
      };
    },
    emitEvent(message) {
      if (message) {
        const { parts: attachments } = message.payload;

        attachments.filter((attachment) => attachment.body.attachmentId).forEach((attachment) => {
          this.$emit({
            message,
            attachment,
          }, this.generateMeta(attachment, message));
        });
      }
    },
  },
};
