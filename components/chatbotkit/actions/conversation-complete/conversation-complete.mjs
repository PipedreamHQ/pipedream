import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-conversation-complete",
  name: "Mark Conversation as Complete",
  description: "Marks a conversation as completed. [See the documentation](https://chatbotkit.com/docs/api/v1/spec)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatbotkit,
    conversationId: {
      propDefinition: [
        chatbotkit,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatbotkit.markConversationComplete(this.conversationId);
    $.export("$summary", `Marked conversation ${this.conversationId} as complete`);
    return response;
  },
};
