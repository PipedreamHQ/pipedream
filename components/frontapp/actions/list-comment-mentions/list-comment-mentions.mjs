import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-comment-mentions",
  name: "List Comment Mentions",
  description: "List the teammates mentioned in a comment. [See the documentation](https://dev.frontapp.com/reference/list-comment-mentions)",
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
    commentId: {
      propDefinition: [
        frontApp,
        "commentId",
        (c) => ({
          conversationId: c.conversationId,
        }),
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
      fn: this.frontApp.listCommentMentions,
      maxResults: this.maxResults,
      $,
      commentId: this.commentId,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }
    $.export("$summary", `Successfully retrieved ${results?.length} mention${results?.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
