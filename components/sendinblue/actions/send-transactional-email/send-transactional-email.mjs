import sendinBlueApp from "../../sendinblue.app.mjs";

// legacy_hash_id: a_0Mi7n5
export default {
  key: "sendinblue-send-transactional-email",
  name: "Send transactional email",
  description: "Send transactional email",
  version: "0.0.17",
  type: "action",
  props: {
    sendinBlueApp,
    sender: {
      type: "object",
      label: "Sender",
      description: "Pass name (optional) and email or id of sender from which emails will be sent.\nName will be ignored if passed along with sender id.\n**Example:** `{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }` or `{ \"id\": 1 }`",
      default: {
        "name": "John Doe",
        "email": "john@doe.com",
      },
    },
    replyTo: {
      type: "object",
      label: "Reply To",
      description: "Email (required), along with name (optional), on which transactional mail recipients will be able to reply back.\n\n**Example:** `{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }`",
      default: {
        "name": "John Doe",
        "email": "john@doe.com",
      },
    },
    to: {
      type: "any",
      label: "To",
      description: "List of email addresses and names (optional) of the recipients.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message.",
    },
    htmlContent: {
      type: "string",
      label: "Html Content",
      description: "HTML body of the message.",
    },
    cc: {
      type: "any",
      label: "CC",
      optional: true,
      description: "List of email addresses and names (optional) of the recipients in cc.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
    },
    bcc: {
      type: "any",
      label: "BCC",
      optional: true,
      description: "List of email addresses and names (optional) of the recipients in bcc.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
    },
    textContent: {
      type: "string",
      label: "Text Content",
      optional: true,
      description: "Plain Text body of the message.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      optional: true,
      description: "Tag your emails to find them more easily.",
    },
  },
  async run({ $ }) {
    const tags = this.tags ?
      Object.keys(this.tags).map((key) => this.tags[key])
      : null;
    const to = this.to
      ? JSON.parse(this.to)
      : null;
    const cc = this.cc ?
      JSON.parse(this.cc)
      : null;
    const bcc = this.cc ?
      JSON.parse(this.bcc) :
      null;

    const emailSent = await this.sendinBlueApp.sendTransactionalEmail(
      $,
      this.sender,
      this.replyTo,
      to,
      this.subject,
      this.htmlContent,
      this.textContent,
      tags,
      cc,
      bcc,
    );
    $.export("$summary", "Transactional email successfully sent");
    return emailSent;
  },
};
