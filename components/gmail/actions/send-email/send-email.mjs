import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send)",
  version: "0.1.18",
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
        "message",
      ],
      label: "In Reply To",
      description: "Specify the `message-id` this email is replying to.",
      optional: true,
      reloadProps: true,
    },
    mimeType: {
      propDefinition: [
        gmail,
        "mimeType",
      ],
    },
  },
  additionalProps(existingProps) {
    const props = {};
    if (this.inReplyTo) {
      props.replyAll = {
        type: "boolean",
        label: "Reply All",
        description: "Set to `true` to send reply to emails in the \"From\", \"To\", \"CC\", and \"BCC\" (if available) of the original email",
        optional: true,
        reloadProps: true,
      };
    }
    existingProps.to.hidden = !!this.replyAll;
    existingProps.cc.hidden = !!this.replyAll;
    existingProps.bcc.hidden = !!this.replyAll;
    return props;
  },
  async run({ $ }) {
    this.attachmentFilenames = utils.parseArray(this.attachmentFilenames);
    this.attachmentUrlsOrPaths = utils.parseArray(this.attachmentUrlsOrPaths);
    if (this.attachmentFilenames?.length !== this.attachmentUrlsOrPaths?.length) {
      throw new ConfigurationError("Must specify the same number of `Attachment Filenames` and `Attachment URLs or Paths`");
    }
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", "Successfully sent the email");
    return response;
  },
};
