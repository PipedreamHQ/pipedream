import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-conversation-messages",
  name: "Get Conversation Messages",
  description: "Retrieve messages from a LinkedIn conversation. [See the documentation](https://docs.linkupapi.com/api-reference/v2/messages/get-conversation)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getConversationMessages({
      $,
      accountId: this.accountId,
      params: {
        conversation_id: this.conversationId,
      },
    });

    $.export("$summary", `Successfully retrieved messages for conversation ${this.conversationId}`);
    return response;
  },
};
