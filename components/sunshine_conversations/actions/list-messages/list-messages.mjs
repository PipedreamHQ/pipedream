import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-list-messages",
  name: "List Messages",
  description: "List messages. [See the documentation](https://docs.sunshine-conversations.com/reference/listmessages)",
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
    maxResults: {
      propDefinition: [
        sunshineConversations,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.sunshineConversations.paginate({
      fn: this.sunshineConversations.listMessages,
      $,
      conversationId: this.conversationId,
      resourceKey: "messages",
      maxResults: this.maxResults,
    });

    const messages = [];
    for await (const message of response) {
      messages.push(message);
    }

    $.export("$summary", `Successfully retrieved ${messages.length} message(s)`);
    return messages;
  },
};
