import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-join-conversation",
  name: "Join Conversation",
  description: "Join a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Conversations/operation/JoinConversation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    newUserId: {
      type: "string",
      label: "New User ID",
      description: "The ID of the user to join the conversation",
    },
    subscribeSDKClient: {
      type: "boolean",
      label: "Subscribe SDK Client",
      description: "When passed as true, the SDK client of the concerned participant will be subscribed to the conversation. The user will start receiving push notifications for this conversation right away, without having to view the conversation on the SDK beforehand. An SDK client will be created for users that don’t already have one. This field is required if the conversation is of type `sdkGroup`",
    },
  },
  async run({ $ }) {
    const response = await this.sunshineConversations.joinConversation({
      $,
      conversationId: this.conversationId,
      data: {
        userId: this.newUserId,
        subscribeSDKClient: this.subscribeSDKClient,
      },
    });

    $.export("$summary", `Successfully joined user with ID ${this.newUserId} to conversation with ID ${this.conversationId}`);
    return response;
  },
};
