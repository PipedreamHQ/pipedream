import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-get-conversation",
  name: "Get Conversation",
  description: "Get a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Conversations/operation/GetConversation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sunshineConversations,
    userId: {
      propDefinition: [
        sunshineConversations,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        sunshineConversations,
        "conversationId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sunshineConversations.getConversation({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Successfully retrieved conversation ${this.conversationId}`);
    return response;
  },
};
