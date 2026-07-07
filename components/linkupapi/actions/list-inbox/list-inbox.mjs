import app from "../../linkupapi.app.mjs";

export default {
  key: "linkupapi-list-inbox",
  name: "List Inbox",
  description: "List conversations from the connected account's LinkedIn inbox, each with its `conversation_id` to use with **Get Conversation Messages**. Paginates automatically up to **Total Results**. [See the documentation](https://docs.linkupapi.com/api-reference/v2/messages/list-inbox)",
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
    const max = this.totalResults;
    const conversations = [];
    let cursor;
    let page = [];

    do {
      const { data } = await this.app.listInbox({
        $,
        accountId: this.accountId,
        params: {
          count: max - conversations.length,
          cursor,
        },
      });

      page = data?.conversations || [];
      conversations.push(...page);
      cursor = data?.next_cursor;
    } while (cursor && page.length && conversations.length < max);

    $.export("$summary", `Successfully retrieved ${conversations.length} conversation${conversations.length === 1
      ? ""
      : "s"}`);
    return conversations;
  },
};
