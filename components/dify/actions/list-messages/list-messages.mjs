import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-messages",
  name: "List Messages",
  description: "Return a Dify Chatflow, Chatbot, Agent, or Legacy Agent conversation's message history, newest first. Use **List Conversations** to find a `Conversation ID`. Each message includes the `query`/`answer` pair, so this is how an agent reconstructs prior turns of a conversation instead of relying on its own memory. [See the documentation](https://docs.dify.ai/en/api-reference/conversations/list-conversation-messages)",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation to read. Use **List Conversations** to find valid IDs.",
    },
    user: {
      propDefinition: [
        dify,
        "user",
      ],
      description: "A unique identifier for the end user who owns this conversation. This must match the `User` value passed to **Send Chat Message** for the conversation to be visible — Dify silently returns an empty page instead of an error when `User` is omitted.",
    },
    firstId: {
      type: "string",
      label: "First Message ID",
      description: "Pagination cursor: the `id` of the first (oldest) message on the current page. Pass it to fetch the previous, older page. Omit to fetch the most recent messages.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of messages to return, between `1` and `100`. Defaults to `20`.",
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dify.listMessages({
      $,
      params: {
        conversation_id: this.conversationId,
        user: this.user,
        first_id: this.firstId,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response.data.length} message(s) in conversation ${this.conversationId}`);
    return response;
  },
};
