import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send)",
  version: "0.1.3",
  type: "action",
  props: {
    gmail,
    to: {
      propDefinition: [
        gmail,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        gmail,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        gmail,
        "bcc",
      ],
    },
    fromName: {
      propDefinition: [
        gmail,
        "fromName",
      ],
    },
    replyTo: {
      propDefinition: [
        gmail,
        "replyTo",
      ],
    },
    subject: {
      propDefinition: [
        gmail,
        "subject",
      ],
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
    attachments: {
      propDefinition: [
        gmail,
        "attachments",
      ],
    },
    inReplyTo: {
      propDefinition: [
        gmail,
        "inReplyTo",
      ],
    },
    mimeType: {
      propDefinition: [
        gmail,
        "mimeType",
      ],
    },
  },
  async run({ $ }) {
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};
