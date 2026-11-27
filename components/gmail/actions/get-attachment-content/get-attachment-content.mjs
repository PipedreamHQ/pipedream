import { ConfigurationError } from "@pipedream/platform";
import gmail from "../../gmail.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-get-attachment-content",
  name: "Get Attachment Content",
  description:
    "Return a Gmail attachment's content as base64 so a client can use it directly, for example to show an image inline or read a small text file."
    + " Call **Find Emails** with `fields: [\"subject\", \"attachments\"]`, or **Get Thread**, first to get the message `id` and the attachment's `partId`."
    + " Not for saving a file to disk (use **Download Attachment**) or for listing a message's attachments (use **Find Emails** or **Get Thread**)."
    + " `data` is standard padded base64 (`+` and `/`, not base64url), so it can go straight into `data:<mimeType>;base64,<data>`. `size` is the decoded byte length."
    + " Attachments larger than `maxBytes` are not downloaded: the result has `tooLarge: true`, the real `size`, a `message`, and `data: null`; the default limit is " + constants.DEFAULT_MAX_ATTACHMENT_BYTES + " bytes and it can be raised to at most " + constants.MAX_ATTACHMENT_BYTES + "."
    + " Returns `filename`, `mimeType`, `size`, `encoding` (always `base64`) and `data`."
    + " Example: messageId=\"19a2b3c4d5e6f789\", partId=\"1\" → `{ filename: \"chart.png\", mimeType: \"image/png\", size: 1843, encoding: \"base64\", data: \"iVBORw0KGgo...\" }`."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages.attachments/get).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    gmail,
    messageId: {
      propDefinition: [
        gmail,
        "attachmentMessageId",
      ],
    },
    partId: {
      propDefinition: [
        gmail,
        "attachmentPartId",
      ],
    },
    maxBytes: {
      type: "integer",
      label: "Max Bytes",
      description: "Largest attachment to return, in bytes, e.g. `2000000`. Larger attachments are rejected before download. Defaults to " + constants.DEFAULT_MAX_ATTACHMENT_BYTES + "; the maximum allowed is " + constants.MAX_ATTACHMENT_BYTES + ".",
      optional: true,
      min: 1,
      max: constants.MAX_ATTACHMENT_BYTES,
    },
  },
  async run({ $ }) {
    const maxBytes = this.maxBytes ?? constants.DEFAULT_MAX_ATTACHMENT_BYTES;
    if (maxBytes > constants.MAX_ATTACHMENT_BYTES) {
      throw new ConfigurationError(`\`maxBytes\` cannot exceed ${constants.MAX_ATTACHMENT_BYTES}.`);
    }
    const partId = String(this.partId).trim();
    const message = await this.gmail.getMessage({
      id: this.messageId,
    });
    const part = utils.findAttachmentPart(message.payload, partId);
    if (!part) {
      const available = utils.getAttachments(message.payload)
        .map((a) => `${a.partId} (${a.filename})`)
        .join(", ");
      throw new ConfigurationError(`No attachment with partId \`${partId}\` in message ${this.messageId}. ${available
        ? `Attachments in this message: ${available}.`
        : "This message has no attachments."}`);
    }
    const tooLarge = (size) => {
      $.export("$summary", `Attachment ${part.filename} (${size} bytes) is over the ${maxBytes}-byte limit`);
      return {
        filename: part.filename,
        mimeType: part.mimeType,
        size,
        tooLarge: true,
        maxBytes,
        data: null,
        message: `Attachment \`${part.filename}\` is ${size} bytes, over the limit of ${maxBytes}, so no content was returned. Raise \`maxBytes\` (up to ${constants.MAX_ATTACHMENT_BYTES}) or use **Download Attachment** to save it as a file.`,
      };
    };
    let buffer;
    if (part.body.attachmentId) {
      if (part.body.size > maxBytes) return tooLarge(part.body.size);
      const attachment = await this.gmail.getAttachment({
        messageId: this.messageId,
        attachmentId: part.body.attachmentId,
      });
      buffer = Buffer.from(attachment.data, "base64url");
    } else {
      buffer = Buffer.from(part.body.data, "base64url");
    }
    if (buffer.length > maxBytes) return tooLarge(buffer.length);

    $.export("$summary", `Fetched attachment ${part.filename} (${buffer.length} bytes)`);

    return {
      filename: part.filename,
      mimeType: part.mimeType,
      size: buffer.length,
      encoding: "base64",
      data: buffer.toString("base64"),
    };
  },
};
