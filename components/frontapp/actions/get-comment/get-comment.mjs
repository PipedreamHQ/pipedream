import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-comment",
  name: "Get Comment",
  description: "Retrieve a comment from a conversation. [See the documentation](https://dev.frontapp.com/reference/get-comment)",
  version: "0.0.4",
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
  },
  async run({ $ }) {
    const response = await this.frontApp.getComment({
      $,
      commentId: this.commentId,
    });
    $.export("$summary", `Successfully retrieved comment with ID: ${this.commentId}`);
    return response;
  },
};
