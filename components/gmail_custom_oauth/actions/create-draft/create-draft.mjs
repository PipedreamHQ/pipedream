/* eslint-disable pipedream/props-description */
import gmail from "../../gmail_custom_oauth.app.mjs";

export default {
  key: "gmail_custom_oauth-create-draft",
  name: "Create Draft",
  description: "Create a draft from your Google Workspace email account",
  version: "0.0.7",
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
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    const response = await this.gmail.createDraft(opts);
    $.export("$summary", "Successfully created a draft message");
    return response;
  },
};
