import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-create-draft",
  name: "Create Draft",
  description: "Create a draft from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create)",
  version: "0.1.8",
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
    },
    mimeType: {
      propDefinition: [
        gmail,
        "mimeType",
      ],
    },
    fromEmail: {
      propDefinition: [
        gmail,
        "fromEmail",
      ],
    },
    signature: {
      propDefinition: [
        gmail,
        "signature",
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
    const response = await this.gmail.createDraft(opts);
    $.export("$summary", "Successfully created a draft message");
    return response;
  },
};
