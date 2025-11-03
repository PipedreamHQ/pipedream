import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";
import common from "../common/polling-messages.mjs";
import { Readable } from "stream";

export default {
  ...common,
  key: "gmail-new-attachment-received",
  name: "New Attachment Received",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.2.2",
  type: "source",
  dedupe: "unique",
  props: {
    gmail,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: May not emit events for attachments sent via a Gmail alias. [See issue](https://github.com/PipedreamHQ/pipedream/issues/15309) for more information.",
    },
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
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload attachment to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
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
    /**
     * Downloads a specific attachment from a Gmail message, uploads it to this
     * source's File Stash folder, and returns the upload details.
     * @param {string} messageId - The ID of the message containing the attachment.
     * @param {Object} attachment - The attachment metadata.
     * @returns {Promise<{path: string, get_url: string, s3Key: string}>} - The
     * uploaded file details.
     */
    async stashAttachment(messageId, attachment) {
      const attachmentId = attachment.body.attachmentId;
      // Download the attachment from Gmail
      const messageAttachment =  await this.gmail.getAttachment({
        messageId,
        attachmentId,
      });
      const buffer = Buffer.from(messageAttachment.data, "base64");
      // Construct a file path unique to this attachment to avoid overwriting
      // files with the same name.
      const filepath = `${messageId}-${attachment.partId}/${attachment.filename}`;
      // Upload the attachment to the configured directory (File Stash) so it
      // can be accessed later.
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        attachment.mimeType,
        attachment.size,
      );
      // Return file details and temporary download link:
      // { path, get_url, s3Key, type }
      return await file.withoutPutUrl().withGetUrl();
    },
    async emitEvent(message) {
      if (message) {
        const { parts: attachments = [] } = message.payload;
        const parsedMessage = utils.validateTextPayload(message, this.withTextPayload);

        for (const attachment of attachments.filter((attachment) => attachment.body.attachmentId)) {
          const event = {
            message: parsedMessage || message,
            attachment,
          };
          if (this.includeLink) {
            event.file = await this.stashAttachment(message.id, attachment);
          }
          this.$emit(event, this.generateMeta(attachment, message));
        }
      }
    },
  },
};
