import app from "../../linkupapi.app.mjs";

export default {
  key: "linkupapi-list-inbox",
  name: "List Inbox",
  description: "List conversations from the LinkedIn inbox, each with its `conversation_id` to use with **Get Conversation Messages**. [See the documentation](https://docs.linkupapi.com/api-reference/v2/messages/list-inbox)",
  version: "0.0.1",
  type: "action",
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
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const conversations = await this.app.paginate({
      max: this.totalResults,
      requestPage: ({
        next, count,
      }) => this.app.listInbox({
        $,
        accountId: this.accountId,
        params: {
          count,
          cursor: next,
        },
      }),
      getItems: (res) => res.data?.conversations,
      getNext: (res) => res.data?.next_cursor,
    });

    $.export("$summary", `Successfully retrieved ${conversations.length} conversation${conversations.length === 1
      ? ""
      : "s"}`);
    return conversations;
  },
};
