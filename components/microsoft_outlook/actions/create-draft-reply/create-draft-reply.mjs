import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-create-draft-reply",
  name: "Create Draft Reply",
  description: "Create a draft reply to an email. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-createreply)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
    },
    recipients: {
      propDefinition: [
        microsoftOutlook,
        "recipients",
      ],
    },
    ccRecipients: {
      propDefinition: [
        microsoftOutlook,
        "ccRecipients",
      ],
    },
    bccRecipients: {
      propDefinition: [
        microsoftOutlook,
        "bccRecipients",
      ],
    },
    subject: {
      propDefinition: [
        microsoftOutlook,
        "subject",
      ],
    },
    comment: {
      propDefinition: [
        microsoftOutlook,
        "content",
      ],
      description: "Content of the reply in text format",
    },
    files: {
      propDefinition: [
        microsoftOutlook,
        "files",
      ],
    },
    expand: {
      propDefinition: [
        microsoftOutlook,
        "expand",
      ],
      description: "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
    },
  },
  methods: {
    async createReply({
      messageId, data = {},
    } = {}) {
      return await this.microsoftOutlook.client().api(`/me/messages/${messageId}/createReply`)
        .post(data);
    },
  },
  async run({ $ }) {
    const response = await this.createReply({
      messageId: this.messageId,
      data: {
        comment: this.comment,
        message: {
          ...await this.microsoftOutlook.prepareMessageBody(this),
          ...this.expand,
        },
      },
    });
    $.export("$summary", "Reply draft has been created.");
    return response;
  },
};
