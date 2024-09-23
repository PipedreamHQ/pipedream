import gmail from "../../gmail.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

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
    attachmentFilenames: {
      propDefinition: [
        gmail,
        "attachmentFilenames",
      ],
    },
    attachmentUrlsOrPaths: {
      propDefinition: [
        gmail,
        "attachmentUrlsOrPaths",
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
    this.attachmentFilenames = utils.parseArray(this.attachmentFilenames);
    this.attachmentUrlsOrPaths = utils.parseArray(this.attachmentUrlsOrPaths);
    if (this.attachmentFilenames?.length !== this.attachmentUrlsOrPaths?.length) {
      throw new ConfigurationError("Must specify the same number of `Attachment Filenames` and `Attachment URLs or Paths`");
    }
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};
