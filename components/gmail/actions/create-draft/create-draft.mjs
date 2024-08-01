import common from "../../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-create-draft",
  name: "Create Draft",
  description: "Create a draft from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    to: {
      propDefinition: [
        common.props.gmail,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        common.props.gmail,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        common.props.gmail,
        "bcc",
      ],
    },
    fromName: {
      propDefinition: [
        common.props.gmail,
        "fromName",
      ],
    },
    replyTo: {
      propDefinition: [
        common.props.gmail,
        "replyTo",
      ],
    },
    subject: {
      propDefinition: [
        common.props.gmail,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        common.props.gmail,
        "body",
      ],
    },
    bodyType: {
      propDefinition: [
        common.props.gmail,
        "bodyType",
      ],
    },
    attachments: {
      propDefinition: [
        common.props.gmail,
        "attachments",
      ],
    },
    inReplyTo: {
      propDefinition: [
        common.props.gmail,
        "message",
      ],
      label: "In Reply To",
      description: "Specify the `message-id` this email is replying to.",
      optional: true,
    },
    mimeType: {
      propDefinition: [
        common.props.gmail,
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
