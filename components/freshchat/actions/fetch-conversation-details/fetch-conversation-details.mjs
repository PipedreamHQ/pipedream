import freshchat from "../../freshchat.app.mjs";

export default {
  key: "freshchat-fetch-conversation-details",
  name: "Fetch Conversation Details",
  description: "Fetches details for a specific conversation. [See the documentation](https://developers.freshchat.com/api/#retrieve_a_conversation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshchat,
    userId: {
      propDefinition: [
        freshchat,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        freshchat,
        "conversationId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshchat.getConversation({
      conversationId: this.conversationId,
    });
    $.export("$summary", `Fetched conversation details for conversation ${this.conversationId}`);
    return response;
  },
};
