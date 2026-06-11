import { ConfigurationError } from "@pipedream/platform";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description:
    "Send a new email OR reply to an existing thread from the authenticated Gmail account."
    + " For a fresh message, set `to`/`subject`/`body`; leave `inReplyToMessageId` blank."
    + " To reply to a thread, pass the `id` of any message in that thread as `inReplyToMessageId` — the tool preserves threading (`References`, `In-Reply-To`, `threadId`) and auto-prefixes `Re:` on the subject. Use **Find Emails** or **Get Thread** to locate the message ID."
    + " Set `replyAll: true` to fan-out to the original `From`/`To`/`Cc` (minus the user's own address); otherwise only the original sender is addressed."
    + " `bodyType` controls whether `body` is treated as plain text (default) or HTML."
    + " To send to yourself, pass `\"me\"` in `to` — the action resolves it to the authenticated user's email address. No pre-call to **Get Current User** required."
    + " Attachments: for small inline content (the common case in MCP / cloud runs), set `attachmentContent` to the file's text contents and `attachmentFilename` to its name. For files already on disk (Pipedream workflows, File Stash), use `attachments[]` + `attachmentFilenames[]` instead."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send).",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    to: {
      propDefinition: [
        gmail,
        "to",
      ],
      optional: true,
      description: "Recipient email addresses. Pass `\"me\"` to send to yourself — the action resolves it to the authenticated user's email address. Ignored when `replyAll` is true (recipients are computed from the original message).",
    },
    cc: {
      propDefinition: [
        gmail,
        "cc",
      ],
      description: "Cc recipient email addresses. Pass `\"me\"` to include yourself.",
    },
    bcc: {
      propDefinition: [
        gmail,
        "bcc",
      ],
      description: "Bcc recipient email addresses. Pass `\"me\"` to include yourself.",
    },
    subject: {
      propDefinition: [
        gmail,
        "subject",
      ],
      optional: true,
      description: "Subject line. When `inReplyToMessageId` is set, the subject is taken from the replied-to message with `Re:` prefixed and this value is ignored.",
    },
    body: {
      propDefinition: [
        gmail,
        "body",
      ],
    },
    bodyType: {
      propDefinition: [
        gmail,
        "bodyType",
      ],
    },
    fromName: {
      propDefinition: [
        gmail,
        "fromName",
      ],
    },
    fromEmail: {
      propDefinition: [
        gmail,
        "fromEmail",
      ],
    },
    replyTo: {
      propDefinition: [
        gmail,
        "replyTo",
      ],
    },
    inReplyToMessageId: {
      propDefinition: [
        gmail,
        "inReplyToMessageId",
      ],
    },
    replyAll: {
      propDefinition: [
        gmail,
        "replyAll",
      ],
    },
    attachmentContent: {
      type: "string",
      label: "Attachment Content",
      description: "Inline text content to attach as a file. Use this instead of a file path when running in an MCP / cloud environment where there is no local filesystem to read from.",
      optional: true,
    },
    attachmentFilename: {
      type: "string",
      label: "Attachment Filename",
      description: "Filename for the inline attachment (include extension, e.g. `dna.txt`). Used only when `attachmentContent` is provided. Defaults to `attachment.txt`.",
      optional: true,
      default: "attachment.txt",
    },
    attachmentFilenames: {
      propDefinition: [
        gmail,
        "attachmentFilenames",
      ],
    },
    attachments: {
      propDefinition: [
        gmail,
        "attachments",
      ],
      description: "Paths to files on disk (or public URLs). Each entry pairs with the same-index entry in `attachmentFilenames[]`. If running in MCP or a cloud environment without a local filesystem, use `attachmentContent` instead.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const filenames = this.attachmentFilenames ?? [];
    const files = this.attachments ?? [];
    if (filenames.length !== files.length) {
      throw new ConfigurationError("`attachments` and `attachmentFilenames` must be the same length.");
    }

    const to = await this.gmail.resolveMe(this.to);
    const cc = await this.gmail.resolveMe(this.cc);
    const bcc = await this.gmail.resolveMe(this.bcc);

    const opts = await this.gmail.getOptionsToSendEmail({
      ...this,
      to,
      cc,
      bcc,
    });

    if (this.attachmentContent != null && this.attachmentContent !== "") {
      opts.attachments = opts.attachments ?? [];
      opts.attachments.push({
        filename: this.attachmentFilename || "attachment.txt",
        content: this.attachmentContent,
      });
    }

    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Sent email ${response.id} on thread ${response.threadId}`);
    return response;
  },
};
