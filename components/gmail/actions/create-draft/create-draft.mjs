import gmail from "../../gmail.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gmail-create-draft",
  name: "Create Draft",
  description: "Create a draft from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    if ((this.attachmentFilename && ! this.attachmentUrlOrPath)
      || (!this.attachmentFilename && this.attachmentUrlOrPath)) {
      throw new ConfigurationError("Must specify both `Attachment Filename` and `Attachment URL or Path`");
    }
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.createDraft(opts);
    $.export("$summary", "Successfully created a draft message");
    return response;
  },
};
