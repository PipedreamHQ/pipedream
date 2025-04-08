import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    gmail,
    ...common.props,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
    },
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    constructQuery(lastDate) {
      const { q: query } = this;
      const hasAttachment = query?.includes("has:attachment")
        ? ""
        : "has:attachment";
      const after = !query?.includes("after:") && lastDate
        ? `after:${Math.trunc(lastDate / 1000)}`
        : "";
      const q = [
        hasAttachment,
        after,
        query,
      ].join(" ").trim();
      console.log(`Polling for new messages with query: ${q}`);
      return q;
    },
    getLabels() {
      return this.labels;
    },
    generateMeta(attachment, message) {
      return {
        id: `${message.id}${attachment.partId}`,
        summary: `New Attachment: ${attachment.filename}`,
        ts: +message.internalDate,
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
