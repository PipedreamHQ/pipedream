import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-conversation-complete",
  name: "Send Conversation Message",
  description: "Send and receive a conversation response. [See the documentation](https://chatbotkit.com/docs/api/v1/spec)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatbotkit,
    conversationId: {
      propDefinition: [
        chatbotkit,
        "conversationId",
      ],
    },
    message: {
      propDefinition: [
        chatbotkit,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatbotkit.completeConversation({
      conversationId: this.conversationId,
      data: {
        text: this.message,
      },
      $,
    });
    $.export("$summary", `Successfully sent message to conversation ${this.conversationId}`);
    return response;
  },
};
