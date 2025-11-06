import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-get-conversation",
  name: "Get Conversation",
  description: "Gets a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/getConversationsConversationid)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dixa,
    endUserId: {
      propDefinition: [
        dixa,
        "endUserId",
      ],
    },
    conversationId: {
      propDefinition: [
        dixa,
        "conversationId",
        ({ endUserId }) => ({
          endUserId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dixa.getConversation({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved conversation ${this.conversationId}`);
    return response;
  },
};
