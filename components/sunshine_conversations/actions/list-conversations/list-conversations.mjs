import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-list-conversations",
  name: "List Conversations",
  description: "List all conversations that a user is part of. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Conversations/operation/ListConversations)",
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
      description: "The ID of the user whose conversations to list.",
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
      fn: this.sunshineConversations.getConversations,
      $,
      params: {
        filter: {
          userId: this.userId,
        },
      },
      resourceKey: "conversations",
      maxResults: this.maxResults,
    });

    const conversations = [];
    for await (const conversation of response) {
      conversations.push(conversation);
    }

    $.export("$summary", `Successfully retrieved ${conversations.length} conversation(s)`);
    return conversations;
  },
};
