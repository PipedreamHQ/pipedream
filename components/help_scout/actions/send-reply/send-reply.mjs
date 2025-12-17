import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-send-reply",
  name: "Send Reply",
  description: "Sends a reply to a conversation. Be careful as this sends an actual email to the customer. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/reply/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    customerId: {
      propDefinition: [
        helpScout,
        "customerId",
      ],
    },
    text: {
      propDefinition: [
        helpScout,
        "text",
      ],
      description: "The content of the reply.",
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "If set to true, a draft reply is created.",
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.sendReplyToConversation({
      $,
      conversationId: this.conversationId,
      data: {
        customer: {
          id: this.customerId,
        },
        text: this.text,
        draft: this.draft,
      },
    });

    $.export("$summary", `Reply sent successfully to conversation ID: ${this.conversationId}`);
    return response;
  },
};
