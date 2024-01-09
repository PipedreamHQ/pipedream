import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-create-conversation",
  name: "Create Conversation",
  description: "Creates a new conversation in the bot. [See the documentation](https://chatbotkit.com/docs/api/v1/spec)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatbotkit,
    userId: {
      propDefinition: [
        chatbotkit,
        "userId",
      ],
    },
    topicId: {
      propDefinition: [
        chatbotkit,
        "topicId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const conversation = await this.chatbotkit.createConversation(this.userId, this.topicId);
    $.export("$summary", `Created conversation with ID: ${conversation.id}`);
    return conversation;
  },
};
