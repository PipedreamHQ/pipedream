import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.1.0",
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
    withTextPayload: {
      type: "boolean",
      label: "Return payload as plaintext",
      description: "Convert the payload response into a single text field. **This reduces the size of the payload and makes it easier for LLMs work with.**",
      default: false,
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
        const { parts: attachments = [] } = message.payload;
        const parsedMessage = utils.validateTextPayload(message, this.withTextPayload);

        attachments.filter((attachment) => attachment.body.attachmentId).forEach((attachment) => {
          this.$emit({
            message: parsedMessage || message,
            attachment,
          }, this.generateMeta(attachment, message));
        });
      }
    },
  },
};
