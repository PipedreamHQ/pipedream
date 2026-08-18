import app from "../../mailtrap.app.mjs";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";

export default {
  name: "Send Email",
  description: "Send a transactional email [See the documentation](https://help.mailtrap.io/article/109-email-sending-api)",
  key: "mailtrap-send-email",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "Sender email address (must belong to a verified sending domain in Mailtrap).",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Sender friendly name (optional).",
      optional: true,
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Recipient email address(es).",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject line.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The plain text version of the message.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML version of the message.",
      optional: true,
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "CC recipient email address(es).",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "BCC recipient email address(es).",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply-To",
      description: "Reply-to email address.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category for tracking and metrics in Mailtrap.",
      optional: true,
    },
    attachmentFiles: {
      type: "string[]",
      label: "Attachment Files",
      description: "Path(s) to files in `/tmp` directory to attach.",
      optional: true,
    },
    attachmentsBase64: {
      type: "string[]",
      label: "Base64 Attachments",
      description: "Base64-encoded file content(s).",
      optional: true,
    },
    base64AttachmentFilenames: {
      type: "string[]",
      label: "Base64 Attachment Filenames",
      description: "Filenames corresponding to Base64-encoded attachments.",
      optional: true,
    },
  },
  methods: {
    async streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      fromEmail,
      fromName,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      replyTo,
      category,
      attachmentFiles,
      attachmentsBase64,
      base64AttachmentFilenames,
    } = this;

    if (!text && !html) {
      throw new ConfigurationError("You must provide either HTML or Text content (or both).");
    }

    const attachments = [];

    if (attachmentFiles) {
      for (const file of attachmentFiles) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        const buffer = await this.streamToBuffer(stream);
        attachments.push({
          filename: metadata.name,
          content: buffer.toString("base64"),
          type: metadata.mimeType,
        });
      }
    }

    if (attachmentsBase64) {
      const hasMismatch =
            !base64AttachmentFilenames ||
            attachmentsBase64.length !== base64AttachmentFilenames.length;

      if (hasMismatch) {
        throw new ConfigurationError(
          "The number of Base64 attachments must match the number of Base64 attachment filenames.",
        );
      }
      for (let i = 0; i < attachmentsBase64.length; i++) {
        attachments.push({
          filename: base64AttachmentFilenames[i],
          content: attachmentsBase64[i],
        });
      }
    }

    const payload = {
      from: {
        email: fromEmail,
        ...(fromName && {
          name: fromName,
        }),
      },
      to: to.map((email) => ({
        email: email.trim(),
      })),
      subject,
      ...(text && {
        text,
      }),
      ...(html && {
        html,
      }),
      ...(cc && {
        cc: cc.map((email) => ({
          email: email.trim(),
        })),
      }),
      ...(bcc && {
        bcc: bcc.map((email) => ({
          email: email.trim(),
        })),
      }),
      ...(replyTo && {
        headers: {
          "Reply-To": replyTo,
        },
      }),
      ...(category && {
        category,
      }),
      ...(attachments.length > 0 && {
        attachments,
      }),
    };

    const response = await this.app.sendEmail({
      $,
      data: payload,
    });

    const messageIds = response?.message_ids?.join(", ") || "Success";
    $.export("$summary", `Successfully sent email (Message ID(s): ${messageIds})`);
    return response;
  },
};
