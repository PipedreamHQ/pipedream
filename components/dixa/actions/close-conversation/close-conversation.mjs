import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-close-conversation",
  name: "Close Conversation",
  description: "Mark a conversation as closed by providing its id. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/putConversationsConversationidClose)",
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
    agentId: {
      propDefinition: [
        dixa,
        "agentId",
      ],
      hidden: false,
      description: "An optional agent/admin to close the conversation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dixa.closeConversation({
      $,
      conversationId: this.conversationId,
      data: {
        agentId: this.agentId,
      },
    });
    $.export("$summary", `Successfully closed conversation ${this.conversationId}`);
    return response;
  },
};
