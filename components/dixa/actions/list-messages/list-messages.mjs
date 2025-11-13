import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-list-messages",
  name: "List Messages",
  description: "Lists messages from a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/getConversationsConversationidMessages).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.dixa.listMessages({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} message(s) from conversation ${this.conversationId}`);
    return response;
  },
};
