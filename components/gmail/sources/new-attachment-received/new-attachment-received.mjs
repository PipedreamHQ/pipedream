import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.10",
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
      const hasAttachment = "has:attachment";
      if (!this.q) {
        this.q = hasAttachment;
      } else if (!this.q.includes(hasAttachment)) {
        this.q = `${this.q} ${hasAttachment}`;
      }
      return common.methods.constructQuery.call(this, lastDate);
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
