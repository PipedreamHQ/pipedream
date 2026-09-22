import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-conversations",
  name: "List Conversations",
  description: "List a Dify Chatflow, Chatbot, Agent, or Legacy Agent app's conversations, most recently active first. Conversations are scoped by `User`, so pass the same value used to create those conversations to see that end user's threads. Example: `User` `user-123`, `Limit` `20` → `{ data: [{ id, name: \"iPhone Specs Chat\", inputs, status: \"normal\", created_at, updated_at }], has_more: true, limit: 20 }`. If `has_more` is `true`, call again with `Last Conversation ID` set to the `id` of the last conversation in `data`. Pass a conversation's `id` to **List Messages** to read it. [See the documentation](https://docs.dify.ai/en/api-reference/conversations/list-conversations)",
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
    user: {
      propDefinition: [
        dify,
        "user",
      ],
    },
    lastId: {
      type: "string",
      label: "Last Conversation ID",
      description: "Pagination cursor: the `id` of the last conversation from the previous page's results. Omit to fetch the first page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of conversations to return, between `1` and `100`. Defaults to `20`.",
      min: 1,
      max: 100,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort results by. Defaults to `-updated_at` (most recently updated first).",
      options: [
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dify.listConversations({
      $,
      params: {
        user: this.user,
        last_id: this.lastId,
        limit: this.limit,
        sort_by: this.sortBy,
      },
    });

    $.export("$summary", `Found ${response.data.length} conversation(s)`);
    return response;
  },
};
