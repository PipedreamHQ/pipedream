import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-reply-to-email",
  name: "Reply to Email",
  description: "Reply to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-reply)",
  version: "0.0.11",
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
      description: "The identifier of the message to reply to",
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
  async run({ $ }) {
    await this.microsoftOutlook.replyToEmail({
      $,
      messageId: this.messageId,
      data: {
        comment: this.comment,
        message: {
          ...await this.microsoftOutlook.prepareMessageBody(this),
          ...this.expand,
        },
      },
    });
    $.export("$summary", "Email has been replied to.");
  },
};
