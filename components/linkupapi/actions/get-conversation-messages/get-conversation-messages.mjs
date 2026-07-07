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
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const messages = await this.app.paginate({
      max: this.totalResults,
      requestPage: ({
        next, count,
      }) => this.app.getConversationMessages({
        $,
        accountId: this.accountId,
        params: {
          conversation_id: this.conversationId,
          count,
          cursor: next,
        },
      }),
      getItems: (res) => res.data?.messages,
      getNext: (res) => res.data?.next_cursor,
    });

    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"} for conversation ${this.conversationId}`);
    return messages;
  },
};
