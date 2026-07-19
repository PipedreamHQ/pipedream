import { getFileStreamAndMetadata } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-send-email",
  name: "Send Email",
  description:
    "Send a new email, reply to an existing message, or save a draft — all in one tool."
    + " Omit `inReplyToMessageId` to send a new email. Provide `inReplyToMessageId` to reply to an existing message (threads correctly)."
    + " Set `isDraft: true` to save to Drafts instead of sending immediately."
    + " Attach files by passing URLs or `/tmp` paths to `files`."
    + " Example (send new): `send-email(recipients=[\"you@example.com\"], subject=\"Hello\", content=\"Hi there\")`"
    + " Example (reply): `send-email(inReplyToMessageId=\"AAMk...\", content=\"Thanks for your note\")`"
    + " Example (draft): `send-email(recipients=[\"boss@example.com\"], subject=\"Weekly report\", content=\"...\", isDraft=true)`"
    + " Use **Find Email** to locate a message `id` before replying."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-sendmail)",
  version: "0.1.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftOutlook,
    recipients: {
      type: "string[]",
      label: "To",
      description: "Array of recipient email addresses, e.g. `[\"alice@example.com\", \"bob@example.com\"]`.",
      optional: true,
      default: [],
    },
    ccRecipients: {
      type: "string[]",
      label: "CC",
      description: "Array of CC recipient email addresses.",
      optional: true,
      default: [],
    },
    bccRecipients: {
      type: "string[]",
      label: "BCC",
      description: "Array of BCC recipient email addresses.",
      optional: true,
      default: [],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject line.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Body",
      description: "Email body content in text or HTML format.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Body Type",
      description: "Content type of the body: `text` (default) or `html`.",
      options: [
        "text",
        "html",
      ],
      default: "text",
      optional: true,
    },
    inReplyToMessageId: {
      type: "string",
      label: "In Reply To Message ID",
      description: "When set, threads the message as a reply to this message ID. Obtain from **Find Email** (`id` field). Omit for a new email.",
      optional: true,
    },
    isDraft: {
      type: "boolean",
      label: "Save as Draft",
      description: "When `true`, saves the message to Drafts instead of sending. Default: `false`.",
      optional: true,
      default: false,
    },
    files: {
      type: "string[]",
      label: "Attachments",
      description: "File URLs or `/tmp` paths to attach. Example: `[\"/tmp/report.pdf\"]`.",
      format: "file-ref",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or UPN of a shared mailbox to send from. Omit to use the authenticated user's mailbox.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const toRecipients = (this.recipients || []).map((address) => ({
      emailAddress: {
        address,
      },
    }));
    const ccRecipients = (this.ccRecipients || [])
      .filter((a) => a && a.trim())
      .map((address) => ({
        emailAddress: {
          address,
        },
      }));
    const bccRecipients = (this.bccRecipients || [])
      .filter((a) => a && a.trim())
      .map((address) => ({
        emailAddress: {
          address,
        },
      }));

    const attachments = [];
    for (const file of (this.files || [])) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      const base64 = await this.microsoftOutlook.streamToBase64(stream);
      attachments.push({
        "@odata.type": "#microsoft.graph.fileAttachment",
        "name": metadata.name,
        "contentType": metadata.contentType,
        "contentBytes": base64,
      });
    }

    const message = {
      subject: this.subject,
      attachments,
    };
    if (this.content) {
      message.body = {
        content: this.content,
        contentType: this.contentType || "text",
      };
    }
    if (toRecipients.length) message.toRecipients = toRecipients;
    if (ccRecipients.length) message.ccRecipients = ccRecipients;
    if (bccRecipients.length) message.bccRecipients = bccRecipients;

    const userPath = this.microsoftOutlook._userPath(this.userId);

    if (this.inReplyToMessageId) {
      if (this.isDraft) {
        const response = await this.microsoftOutlook.client()
          .api(`${userPath}/messages/${this.inReplyToMessageId}/createReply`)
          .post({
            message,
          });
        $.export("$summary", `Draft reply created (id: ${response.id})`);
        return response;
      } else {
        await this.microsoftOutlook.replyToEmail({
          userId: this.userId,
          messageId: this.inReplyToMessageId,
          data: {
            message,
          },
        });
        $.export("$summary", "Reply sent.");
        return {
          success: true,
        };
      }
    } else if (this.isDraft) {
      const response = await this.microsoftOutlook.createDraft({
        userId: this.userId,
        data: message,
      });
      $.export("$summary", `Draft saved (id: ${response.id})`);
      return response;
    } else {
      await this.microsoftOutlook.sendEmail({
        userId: this.userId,
        data: {
          message,
        },
      });
      $.export("$summary", "Email sent.");
      return {
        success: true,
      };
    }
  },
};
