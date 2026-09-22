import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-messages",
  name: "List Messages",
  description: "Return a Dify Chatflow, Chatbot, Agent, or Legacy Agent conversation's message history. The first call returns the latest messages; page backward into older ones with `First Message ID`. Use **List Conversations** to find a `Conversation ID`. Each message includes the `query`/`answer` pair, so this is how an agent reconstructs prior turns of a conversation instead of relying on its own memory. By default each message is trimmed to `id`, `conversation_id`, `query`, `answer`, `status`, `error`, `feedback`, and `created_at`; set `Include Full Details` to also get retrieved knowledge-base passages (`retriever_resources`), agent reasoning (`agent_thoughts`), files, and token usage. Example: `Conversation ID` `45701982-8118-4bc5-8e9b-64562b4555f2`, `User` `user-123` → `{ data: [{ id, conversation_id, query: \"What are the specs of the iPhone 13 Pro Max?\", answer: \"...\", status: \"normal\", feedback: { rating: \"like\" }, created_at }], has_more: true, limit: 20 }`. If `has_more` is `true`, call again with `First Message ID` set to the `id` of the first message in `data` to get older messages. [See the documentation](https://docs.dify.ai/en/api-reference/conversations/list-conversation-messages)",
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
    },
    firstId: {
      type: "string",
      label: "First Message ID",
      description: "Pagination cursor: the `id` of the first message in the current page's `data` array. Pass it to fetch the previous (older) page. Omit to fetch the latest messages.",
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
    includeFullDetails: {
      type: "boolean",
      label: "Include Full Details",
      description: "Return Dify's full message objects, including `retriever_resources`, `agent_thoughts`, `message_files`, `inputs`, and token/price usage. These can be large on knowledge-base and agent apps. Defaults to `false`.",
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

    if (this.includeFullDetails) {
      return response;
    }

    return {
      ...response,
      data: response.data.map(({
        id, conversation_id, query, answer, status, error, feedback, created_at,
      }) => ({
        id,
        conversation_id,
        query,
        answer,
        status,
        error,
        feedback,
        created_at,
      })),
    };
  },
};
