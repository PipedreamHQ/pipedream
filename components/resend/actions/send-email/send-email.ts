import { defineAction } from "@pipedream/types";
import app from "../../app/resend.app";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";

export default defineAction({
  name: "Send Email",
  description:
    "Send an email [See the documentation](https://resend.com/docs/api-reference/emails/send-email)",
  key: "resend-send-email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    from: {
      type: "string",
      label: "From",
      description:
        "Sender email address. To include a friendly name, use the format `Your Name <sender@domain.com>`",
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Recipient email address(es). Max 50.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML version of the message.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The plain text version of the message.",
      optional: true,
    },
    cc: {
      type: "string",
      label: "Cc",
      description: "Cc recipient email address(es).",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "Bcc",
      description: "Bcc recipient email address(es).",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Reply-to email address(es).",
      optional: true,
    },
    attachmentFiles: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "Provide either file URLs or paths to files in the /tmp directory (for example, /tmp/myFile.pdf)",
      optional: true,
    },
    attachmentsBase64: {
      type: "string[]",
      label: "Base64-encoded attachments",
      description: "Provide base64-encoded attachments",
      optional: true,
    },
    base64AttachmentFilenames: {
      type: "string[]",
      label: "Base64-encoded attachment filenames",
      description: "Provide the filenames for the base64-encoded attachments",
      optional: true,
    },
  },
  methods: {
    async streamToBuffer(stream): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      from, to, subject, html, text, cc, bcc, replyTo, attachmentFiles, attachmentsBase64, base64AttachmentFilenames,
    } = this;

    const attachments = [];
    if (attachmentFiles) {
      for (const file of attachmentFiles) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        const buffer = await this.streamToBuffer(stream);
        const base64 = buffer.toString("base64");
        attachments.push({
          filename: metadata.name,
          content: base64,
        });
      }
    }

    if (attachmentsBase64) {
      if (attachmentsBase64.length !== base64AttachmentFilenames.length) {
        throw new ConfigurationError("The number of base64-encoded attachments must match the number of base64-encoded attachment filenames");
      }
      for (let i = 0; i < attachmentsBase64.length; i++) {
        attachments.push({
          filename: base64AttachmentFilenames[i],
          content: attachmentsBase64[i],
        });
      }
    }

    const params = {
      $,
      data: {
        from,
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        reply_to: replyTo,
        attachments,
      },
    };

    const response = await this.app.sendEmail(params);
    const { id } = response;
    $.export("$summary", `Sent email (ID: ${id})`);
    return response;
  },
});
