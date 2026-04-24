import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-create-draft",
  name: "Create Draft",
  description:
    "Create an unsent draft in the authenticated Gmail account. Same parameter shape as **Send Email** — the difference is the message is saved to Drafts instead of being sent."
    + " For a reply-draft, pass `inReplyToMessageId` (from **Find Emails** / **Get Thread**); the subject, `References`, `In-Reply-To`, and `threadId` are derived from the referenced message."
    + " `bodyType` controls whether `body` is treated as plain text (default) or HTML."
    + " To draft to yourself, pass `\"me\"` in `to` — the action resolves it to the authenticated user's email address. No pre-call to **Get Current User** required."
    + " Attachments use `file-ref` inputs and require matching `attachmentFilenames[]` entries."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create).",
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
      description: "Recipient email addresses. Pass `\"me\"` to draft to yourself — the action resolves it to the authenticated user's email address.",
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
      description: "Subject line. When `inReplyToMessageId` is set, the subject is derived from the replied-to message with `Re:` prefixed and this value is ignored.",
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
      throw new Error("`attachments` and `attachmentFilenames` must be the same length.");
    }

    const to = await this.gmail.resolveMe(this.to);
    const cc = await this.gmail.resolveMe(this.cc);
    const bcc = await this.gmail.resolveMe(this.bcc);

    const opts = await this.gmail.getOptionsToSendEmail($, {
      ...this,
      to,
      cc,
      bcc,
    });
    const response = await this.gmail.createDraft(opts);
    $.export("$summary", `Created draft ${response.id}`);
    return response;
  },
};
