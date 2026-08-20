import app from "../../mailtrap.app.mjs";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";

// 10 MB limits for Mailtrap API
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENTS_SIZE_BYTES = 10 * 1024 * 1024;

export default {
  name: "Send Email",
  description:
    "Send a transactional email [See the documentation]" +
    "(https://docs.mailtrap.io/developers/email-sending/transactional#post-api-send)",
  key: "mailtrap-send-email",
  version: "0.0.1",
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
      format: "file-ref",
      label: "Attachment Files",
      description: "File reference(s) to attach.",
      optional: true,
    },
    attachmentsBase64: {
      type: "string[]",
      label: "Base64 Attachments",
      description: "Base64-encoded file content(s), e.g., ['SGVsbG8='].",
      optional: true,
    },
    base64AttachmentFilenames: {
      type: "string[]",
      label: "Base64 Attachment Filenames",
      description:
        "Filenames corresponding to Base64-encoded attachments, e.g., ['report.pdf']." +
        " Filenames must correspond by the same array order as the Base64 values.",
      optional: true,
    },
  },
  methods: {
    async streamToBuffer(stream, options = {}) {
      const {
        maxFileSize = MAX_FILE_SIZE_BYTES,
        maxTotalSize = MAX_TOTAL_ATTACHMENTS_SIZE_BYTES,
        currentCumulativeSize = 0,
        fileName = "attachment",
      } = options;

      return new Promise((resolve, reject) => {
        const chunks = [];
        let fileSize = 0;
        let cumulativeSize = currentCumulativeSize;

        const onData = (chunk) => {
          fileSize += chunk.length;
          cumulativeSize += chunk.length;

          if (fileSize > maxFileSize) {
            cleanup();
            stream.destroy();
            reject(
              new ConfigurationError(
                `Attachment "${fileName}" exceeds max file size limit of ` +
                  `${maxFileSize / (1024 * 1024)}MB.`,
              ),
            );
            return;
          }

          if (cumulativeSize > maxTotalSize) {
            cleanup();
            stream.destroy();
            reject(
              new ConfigurationError(
                "Total attachments size exceeds cumulative limit of " +
                  `${maxTotalSize / (1024 * 1024)}MB.`,
              ),
            );
            return;
          }

          chunks.push(chunk);
        };

        const onEnd = () => {
          cleanup();
          resolve({
            buffer: Buffer.concat(chunks),
            bytesRead: fileSize,
          });
        };

        const onError = (err) => {
          cleanup();
          reject(err);
        };

        const cleanup = () => {
          stream.removeListener("data", onData);
          stream.removeListener("end", onEnd);
          stream.removeListener("error", onError);
        };

        stream.on("data", onData);
        stream.on("end", onEnd);
        stream.on("error", onError);
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
    let totalAttachmentBytes = 0;

    if (attachmentFiles) {
      for (const file of attachmentFiles) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);

        const {
          buffer, bytesRead,
        } = await this.streamToBuffer(stream, {
          fileName: metadata?.name || file,
          currentCumulativeSize: totalAttachmentBytes,
        });

        totalAttachmentBytes += bytesRead;

        attachments.push({
          filename: metadata.name,
          content: buffer.toString("base64"),
          type: metadata.mimeType,
        });
      }
    }

    if (attachmentsBase64?.length > 0) {
      const hasMismatch =
        !base64AttachmentFilenames ||
        attachmentsBase64.length !== base64AttachmentFilenames.length;

      if (hasMismatch) {
        throw new ConfigurationError(
          "The number of Base64 attachments must match the number of Base64 attachment filenames.",
        );
      }

      for (let i = 0; i < attachmentsBase64.length; i++) {
        const content = attachmentsBase64[i];
        const filename = base64AttachmentFilenames[i];
        const decodedSize = Buffer.byteLength(content, "base64");

        if (decodedSize > MAX_FILE_SIZE_BYTES) {
          throw new ConfigurationError(
            `Base64 attachment "${filename}" exceeds max file size limit of ` +
              `${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
          );
        }

        totalAttachmentBytes += decodedSize;

        if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENTS_SIZE_BYTES) {
          throw new ConfigurationError(
            "Total attachments size exceeds cumulative limit of " +
              `${MAX_TOTAL_ATTACHMENTS_SIZE_BYTES / (1024 * 1024)}MB.`,
          );
        }

        attachments.push({
          filename,
          content,
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
        reply_to: {
          email: replyTo,
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
