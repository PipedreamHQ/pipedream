import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-comments",
  name: "List Conversation Comments",
  description: "List the comments in a conversation. [See the documentation](https://dev.frontapp.com/reference/list-conversation-comments)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
    maxResults: {
      propDefinition: [
        frontApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.frontApp.paginate({
      fn: this.frontApp.listComments,
      maxResults: this.maxResults,
      $,
      conversationId: this.conversationId,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }

    $.export("$summary", `Successfully retrieved ${results.length} comment${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
