import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-get-message",
  name: "Get Message",
  description: "Retrieve a single email message by its Microsoft Graph message ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get-message)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
      optional: true,
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
    },
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
        ({ userId }) => ({
          userId,
        }),
      ],
      description: "The Microsoft Graph message ID. Choose a recent message or paste an ID from another step.",
    },
    includeAttachments: {
      type: "boolean",
      label: "Include Attachments",
      description: "If true, returns additional info for message attachments.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = this.includeAttachments
      ? {
        $expand: "attachments",
      }
      : {};

    const message = await this.microsoftOutlook.getMessage({
      $,
      userId: this.userId,
      messageId: this.messageId,
      params,
    });

    const subject = message?.subject ?? "(no subject)";
    $.export("$summary", `Successfully retrieved message "${subject}"`);
    return message;
  },
};
