import gmail from "../../gmail.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send)",
  version: "0.1.5",
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
    attachmentFilename: {
      propDefinition: [
        gmail,
        "attachmentFilename",
      ],
    },
    attachmentUrlOrPath: {
      propDefinition: [
        gmail,
        "attachmentUrlOrPath",
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
    if ((this.attachmentFilename && ! this.attachmentUrlOrPath)
      || (!this.attachmentFilename && this.attachmentUrlOrPath)) {
      throw new ConfigurationError("Must specify both `Attachment Filename` and `Attachment URL or Path`");
    }
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};
